'use server';
import { getCollection } from '@server/mongodb';
import { getServerSession } from '@server/auth-options';
import { ObjectId } from 'mongodb';
import { z, ZodType } from 'zod';
import { WriteUserProfile } from '@common/types/UserProfile';
import {
	DbCollections,
	MaxUserProfileBioLength,
	MaxUserProfileShortBioLength,
} from '@common/constants';

const Validator: ZodType<WriteUserProfile> = z.object({
	shortBio: z
		.string()
		.trim()
		.max(MaxUserProfileShortBioLength),
	detailedBio: z
		.string()
		.trim()
		.max(MaxUserProfileBioLength),
});

export default
async function updateProfile(profile: WriteUserProfile) {
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

		await col.updateOne({ _id }, { $set: { ...userProfile } });

		return { ok: true };
	} catch {
		return { ok: false };
	}
}
