'use server';
import { getCollection } from '@server/mongodb';
import { getServerSession } from '@server/auth-options';
import { ObjectId } from 'mongodb';
import { z, ZodType } from 'zod';
import { WriteUserProfile } from '@common/types/UserProfile';
import { revalidatePath } from 'next/cache';
import {
	DbCollections,
	MaxUserProfileBioLength,
	MaxUserProfileShortBioLength,
	Paths,
	ProfileActivity,
} from '@common/constants';

const Validator: ZodType<Partial<WriteUserProfile>> = z.object({
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

		revalidatePath(Paths.Settings);
		revalidatePath(Paths.UserGallery(session.user.username));

		return { ok: true };
	} catch {
		return { ok: false };
	}
}
