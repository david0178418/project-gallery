import type { NextApiRequest, NextApiResponse } from 'next';

import { getCollection } from '@server/mongodb';
import { getServerSession } from '@server/auth-options';
import { passwordToHash } from '@server/transforms';
import { ObjectId } from 'mongodb';
import { z, ZodType } from 'zod';
import {
	DbCollections,
	PasswordMaxLength,
	PasswordMinLength,
} from '@common/constants';

interface Schema {
	password: string;
}

const schema: ZodType<Schema> = z.object({
	password: z
		.string()
		.min(PasswordMinLength)
		.max(PasswordMaxLength),
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

	const { password } = result.data;

	try{
		await updatePassword(session.user.id, password);

		res.send({ ok: true });
	} catch {
		return res
			.status(400)
			.send({ ok: false });
	}
}

async function updatePassword(userId: string, password: string) {
	const usersCol = await getCollection(DbCollections.Users);
	const hash = await passwordToHash(password);
	const _id = new ObjectId(userId);

	await usersCol.updateOne({ _id }, { $set: { hash } });
}
