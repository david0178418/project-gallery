'use server';
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
async function updatePassword(password: string) {
	const session = await getServerSession();

	if(!session?.user) {
		return {
			ok: false,
			errors: ['Not logged in'],
		};
	}

	const result = await schema.safeParseAsync(password);

	if(!result.success) {
		return {
			ok: false,
			errors: result
				.error
				.errors
				.map(e => e.message),
		};
	}

	try{

		const usersCol = await getCollection(DbCollections.Users);
		const hash = await passwordToHash(password);
		const _id = new ObjectId(session.user.id);

		await usersCol.updateOne({ _id }, { $set: { hash } });

		return { ok: true };
	} catch {
		return { ok: false };
	}
}
