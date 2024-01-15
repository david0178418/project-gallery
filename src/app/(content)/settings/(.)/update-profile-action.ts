'use server';
import { getCollection } from '@server/mongodb';
import { getServerSession } from '@server/auth-options';
import { ObjectId } from 'mongodb';
import { z, ZodType } from 'zod';
import { UserProfileTitleValidation, WriteUserProfile } from '@common/types/UserProfile';
import { revalidatePath } from 'next/cache';
import { CustomLinkValidator } from '@common/types/CustomLink';
import { DisplayNameValidation } from '@common/types/User';
import {
	DbCollections,
	MaxUserProfileBioLength,
	MaxUserProfileShortBioLength,
	Paths,
	ProfileActivity,
} from '@common/constants';

const Validator: ZodType<Partial<WriteUserProfile>> = z.object({
	displayName: DisplayNameValidation,
	title: UserProfileTitleValidation,
	avatar: z
		.string()
		.trim()
		.max(150),
	shortBio: z
		.string()
		.trim()
		.max(MaxUserProfileShortBioLength),
	detailedBio: z
		.string()
		.trim()
		.max(MaxUserProfileBioLength),
	links: z.array(CustomLinkValidator),
}).partial();

export default
async function updateProfile(profile: Partial<WriteUserProfile>) {
	const session = await getServerSession();

	if(!session?.user) {
		return {
			ok: false,
			errors: ['Not logged in'],
		};
	}

	const result = await Validator.safeParseAsync(profile);

	if(!result.success) {
		return {
			ok: false,
			errors: result
				.error
				.errors
				.map(e => e.message),
		};
	}

	const userProfile = result.data;

	try{
		const col = await getCollection(DbCollections.UserProfiles);
		const _id = new ObjectId(session.user.id);

		await col.updateOne({ _id }, {
			$set: {
				...userProfile,
				lastActivity: {
					id: _id,
					date: new Date(),
					type: ProfileActivity.ProfileUpdate,
					label: session.user.username,
				},
			},
		});

		if(userProfile.detailedBio) {
			const userCol = await getCollection(DbCollections.Users);

			await userCol.updateOne({ _id }, { $set: { displayName: userProfile.detailedBio } });
		}

		revalidatePath(Paths.Settings);
		revalidatePath(Paths.UserGallery(session.user.username));
		revalidatePath(Paths.UserGalleryEdit(session.user.username));

		return { ok: true };
	} catch {
		return { ok: false };
	}
}
