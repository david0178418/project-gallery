'use server';
import { getCollection } from '@server/mongodb';
import { getServerSession } from '@server/auth-options';
import { checkCredentialAvailability } from '@server/queries';
import { passwordToHash } from '@server/transforms';
import { ObjectId } from 'mongodb';
import { z, ZodType } from 'zod';
import { DisplayNameValidation } from '@common/types/User';
import {
	DbCollections,
	ProfileActivity,
	UserRoles,
} from '@common/constants';
import {
	EmailValidation,
	PasswordValidation,
	UsernameValidation,
} from '@common/types/UserCredentials';

interface Schema {
	email: string;
	displayName: string;
	password: string;
	username: string;
}

const Validation: ZodType<Schema> = z.object({
	email: EmailValidation,
	displayName: DisplayNameValidation,
	username: UsernameValidation,
	password: PasswordValidation,
});

export default
async function Register(params: Schema) {
	const session = await getServerSession();

	if(session) {
		return {
			ok: false,
			errors: ['Already logged in'],
		};
	}

	const result = await Validation.safeParseAsync(params);

	if(!result.success) {
		return {
			ok: false,
			errors: result
				.error
				.errors
				.map(e => e.message),
		};
	}

	const {
		username,
		email,
		password,
		displayName,
	} = result.data;

	const availabilityResults = await checkCredentialAvailability(username, email);

	if(!availabilityResults.available) {
		const errors = [];

		if(availabilityResults.username) {
			errors.push(`User "${username}" already exists`);
		}

		if(availabilityResults.email) {
			errors.push(`Email "${email}" is already used`);
		}

		return {
			ok: false,
			errors,
		};
	}

	await createUser({
		username,
		displayName,
		email,
		password,
	});

	return { ok: true };
}

export
async function createUser(args: Schema) {
	const {
		email,
		displayName,
		password,
		username,
	} = args;
	const usersCol = await getCollection(DbCollections.Users);
	const userGalleryOrderCol = await getCollection(DbCollections.UserGalleryOrder);
	const usersMetaCol = await getCollection(DbCollections.UsersMeta);
	const userProfilesCol = await getCollection(DbCollections.UserProfiles);
	const hash = await passwordToHash(password);
	const nowDate = new Date();
	const nowISOStr = nowDate.toISOString();
	const _id = new ObjectId();

	const result = await usersCol
		.insertOne({
			_id,
			username,
			displayName,
			usernameLower: username.toLocaleLowerCase(),
			email,
			hash,
			role: UserRoles.User,
		});

	await userGalleryOrderCol
		.insertOne({
			_id,
			usernameLower: username.toLocaleLowerCase(),
			projectIdOrder: [],
		});

	await Promise.all([
		usersMetaCol
			.insertOne({
				_id: result.insertedId,
				userId: result.insertedId,
				created: nowISOStr,
				lastLogin: nowISOStr,
			}),
		userProfilesCol
			.insertOne({
				_id: result.insertedId,
				shortBio: '',
				detailedBio: '',
				username,
				displayName: username,
				title: `${username}'s Gallery`,
				customItems: [],
				lastActivity: {
					date: new Date(),
					type: ProfileActivity.ProfileCreate,
					id: result.insertedId,
					label: username,
				},
			}),
	]);
}
