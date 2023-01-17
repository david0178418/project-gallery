import type { NextApiRequest, NextApiResponse } from 'next';

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

interface Schema {
	userProfile: WriteUserProfile;
}

const schema: ZodType<Schema> = z.object({
	userProfile: z.object({
		shortBio: z
			.string()
			.trim()
			.max(MaxUserProfileShortBioLength),
		detailedBio: z
			.string()
			.trim()
			.max(MaxUserProfileBioLength),
	}),
});

export default
async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	const session = await getServerSession(req, res);

	if(!session?.user) {
		return res.status(401).end();
	}

	const result = await schema.safeParseAsync(req.body);

	if(!result.success) {
		return res
			.status(400)
			.send({
				ok: false,
				errors: result
					.error
					.errors
					.map(e => e.message),
			});
	}

	const { userProfile } = result.data;

	try{
		await updateProfile(session.user.id, userProfile);

		res.send({ ok: true });
	} catch {
		return res
			.status(400)
			.send({ ok: false });
	}
}

async function updateProfile(userId: string, userProfile: WriteUserProfile) {
	const col = await getCollection(DbCollections.UserProfiles);
	const _id = new ObjectId(userId);

	console.log(userId, userProfile);

	await col.updateOne({ _id }, { $set: { ...userProfile } });
}
