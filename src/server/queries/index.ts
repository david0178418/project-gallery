import type { DbUser } from '@common/types/User';
import type { DbProject } from '@common/types/Project';
import { ObjectId, WithId } from 'mongodb';

import { getCollection } from '@server/mongodb';
import { DbCollections, ProfileActivity } from '@common/constants';
import { DbJournal } from '@common/types/Journal';
import { DbUserProfile } from '@common/types/UserProfile';
import { DbUserGalleryOrder } from '@common/types/UserGalleryOrder';
import { add } from 'date-fns';
import { getServerSession } from '@server/auth-options';
import { cache } from 'react';
import { makeId, nowISOString } from '@common/utils';

export
const fetchUser = cache(async (usernameOrEmail: string): Promise<DbUser | null> => {
	console.log('fetchUser start');
	const col = await getCollection(DbCollections.Users);
	const result = await col.aggregate<WithId<DbUser>>([
		{
			$match: {
				$or: [
					{ usernameLower: usernameOrEmail.toLocaleLowerCase() },
					{ email: new RegExp(usernameOrEmail, 'i') },
				],
			},
		},
		{ $limit: 1 },
	]).toArray();

	return result[0] || null;
});

export
async function createUserLoginKey(email: string) {
	console.log('createUserLoginKey start');
	if(!await fetchUser(email)) {
		return '';
	}

	const key = makeId(64);

	const col = await getCollection(DbCollections.UserOneClickLinkKeys);

	await col.updateOne(
		{ email },
		{
			$set: {
				key,
				expirationDate: add(new Date(), { minutes: 10 }).toISOString(),
			},
			$setOnInsert: { email },
		}, { upsert: true });

	return key;
}

export
async function getUserFromKey(key: string): Promise<DbUser | null> {
	console.log('getUserFromKey start');
	const col = await getCollection(DbCollections.UserOneClickLinkKeys);
	const result = await col.findOne({ key });

	if(!result) {
		return null;
	}

	col.deleteOne({ _id: result._id });

	if(result.expirationDate < nowISOString()) {
		return null;
	}

	return fetchUser(result.email);
}

export
async function checkCredentialAvailability(username: string, email: string) {
	console.log('checkCredentialAvailability start');
	const usersCol = await getCollection(DbCollections.Users);
	const results = await usersCol.aggregate<WithId<DbUser>>([
		{
			$match: {
				$or: [
					{ usernameLower: username.toLocaleLowerCase() },
					{ email },
				],
			},
		},
		{ $limit: 2 },
	]).toArray();

	if(!results.length) {
		return { available: true };
	}

	return {
		available: false,
		email: !!results.find(r => r.email === email),
		username: !!results.find(r => r.usernameLower === username.toLocaleLowerCase()),
	};
}

export
async function fetchProjects(): Promise<Array<WithId<DbProject>>> {
	console.log('fetchProjects start');
	const col = await getCollection(DbCollections.Projects);
	return col.aggregate<WithId<DbProject>>([
		{ $match: { unlisted: { $ne: true } } },
		{ $sort: { lastUpdatedDate: -1 } },
		{ $limit: 20 },
	]).toArray();
}

export
async function fetchJournals(ownerId = ''): Promise<Array<WithId<DbJournal>>> {
	console.log('fetchJournals start');
	const col = await getCollection(DbCollections.Journals);
	const publishedOrOwner = ownerId ?
		{
			$or: [
				{ publishedDate: { $ne: null } },
				{ 'owner._id': new ObjectId(ownerId) },
			],
		} : { publishedDate: { $ne: null } };
	return col.aggregate<WithId<DbJournal>>([
		{ $match: publishedOrOwner },
		{ $sort: { publishedDate: -1 } },
		{ $limit: 20 },
	]).toArray();
}

export
const fetchUserProfileByUsername = cache(async (username: string): Promise<DbUserProfile | null> => {
	console.log('fetchUserProfileByUsername start');
	const col = await getCollection(DbCollections.UserProfiles);

	return col.findOne({ username: new RegExp(username, 'i') });
});

export
async function fetchProjectJournals(projectId: string, ownerId = ''): Promise<Array<WithId<DbJournal>>> {
	console.log('fetchProjectJournals start');
	const col = await getCollection(DbCollections.Journals);
	const publishedOrOwner = ownerId ?
		{
			$or: [
				{ publishedDate: { $ne: null } },
				{ 'owner._id': new ObjectId(ownerId) },
			],
		} : { publishedDate: { $ne: null } };
	return col.aggregate<WithId<DbJournal>>([
		{
			$match: {
				'project._id': new ObjectId(projectId),
				...publishedOrOwner,
			},
		},
		{ $sort: { publishedDate: -1 } },
		{ $limit: 20 },
	]).toArray();
}

export
async function fetchProjectsByUser(userId: string): Promise<Array<WithId<DbProject>>> {
	console.log('fetchProjectsByUser start');
	const col = await getCollection(DbCollections.Projects);
	return col.aggregate<WithId<DbProject>>([
		{ $sort: { title: 1 } },
		{ $match: { 'owner._id': new ObjectId(userId) } },
	]).toArray();
}

export
async function fetchProject(id: string): Promise<WithId<DbProject> | null> {
	console.log('fetchProject start');
	const col = await getCollection(DbCollections.Projects);

	return col.findOne({ _id: new ObjectId(id) });
}

export
async function fetchUserHasProjectsByUsername(username: string): Promise<boolean> {
	console.log('userHasProjects start');
	const col = await getCollection(DbCollections.Projects);
	const result = await col.findOne({ 'owner.username': new RegExp(username, 'i') });

	return !!result;
}

export async function fetchUserHasPostsByUsername(username: string): Promise<boolean> {
	console.log('userHasPosts start');
	const col = await getCollection(DbCollections.Journals);
	const result = await col.findOne({ 'owner.username': new RegExp(username, 'i') });

	return !!result;
}

export async function fetchProjectHasPosts(projectId: string): Promise<boolean> {
	console.log('projectHasPosts start');
	const col = await getCollection(DbCollections.Journals);
	const result = await col.findOne({ 'project._id': new ObjectId(projectId) });

	return !!result;
}

export
async function fetchJournal(id: string): Promise<WithId<DbJournal> | null> {
	console.log('fetchJournal start');
	const col = await getCollection(DbCollections.Journals);

	return col.findOne({ _id: new ObjectId(id) });
}

const DocPlaceholder = 'docTemp';

export
async function fetchUserGallery(username: string): Promise<Array<WithId<DbProject>>> {
	console.log('fetchUserGallery start');
	const col = await getCollection(DbCollections.UserGalleryOrder);
	return col.aggregate<WithId<DbProject>>([
		{ $match: { usernameLower: username.toLocaleLowerCase() } },
		{ $unwind: '$projectIdOrder' },
		{
			$lookup: {
				from: DbCollections.Projects,
				localField: 'projectIdOrder',
				foreignField: '_id',
				as: DocPlaceholder,
			},
		},
		{ $unwind: { path: `$${DocPlaceholder}` } },
		{ $replaceRoot: { newRoot: `$${DocPlaceholder}` } },
	]).toArray();
}

export
async function fetchUserProfiles(): Promise<Array<WithId<DbUserProfile>>> {
	console.log('fetchUserGalleries start');
	const col = await getCollection(DbCollections.UserProfiles);
	return col.aggregate<WithId<DbUserProfile>>([
		// { $match: { 'lastActivity.type': { $ne: ProfileActivity.ProfileCreate } } },
		{ $sort: { 'lastActivity.date': -1 } },
	]).toArray();
}

export
async function fetchUserGalleryOrderByUsername(username: string): Promise<WithId<DbUserGalleryOrder> | null> {
	console.log('fetchUserGalleryOrderByUsername start');
	const col = await getCollection(DbCollections.UserGalleryOrder);
	return col.findOne({ usernameLower: username });
}

export
async function fetchUserGalleryOrder(userId: string): Promise<WithId<DbUserGalleryOrder> | null> {
	console.log('fetchUserGalleryOrder start');
	const col = await getCollection(DbCollections.UserGalleryOrder);
	return col.findOne({ _id: new ObjectId(userId) });
}

export
async function fetchUserJournals(username: string): Promise<Array<WithId<DbJournal>>> {
	console.log('fetchUserJournals start');
	const session = await getServerSession();
	const col = await getCollection(DbCollections.Journals);
	const isOwner = session?.user.username === username;
	const ownerCondition = isOwner ?
		{} :
		{ publishedDate: { $ne: null } };

	return col.aggregate<WithId<DbJournal>>([
		{ $sort: { publishedDate: -1 } },
		{
			$match: {
				'owner.username': new RegExp(username, 'i'),
				...ownerCondition,
			},
		},
		{ $limit: 20 },
	]).toArray();
}

export
const updateLastLogin = cache(async (id: ObjectId | string) => {
	console.log('updateLastLogin start', id);
	const col = await getCollection(DbCollections.UsersMeta);

	await col.updateOne(
		{ _id: new ObjectId(id) },
		{ $set: { lastLogin: nowISOString() } },
	);
});

interface UpdateProfileActivityArgs {
	userId: ObjectId;
	activityId: ObjectId;
	type: ProfileActivity;
	label: string;
}

export
async function updateProfileActivity(args: UpdateProfileActivityArgs) {
	const {
		userId,
		activityId,
		type,
		label,
	} = args;
	console.log('updateProfileActivity start', userId);
	const col = await getCollection(DbCollections.UserProfiles);

	await col.updateOne(
		{ _id: new ObjectId(userId) },
		{
			$set: {
				lastActivity: {
					type,
					date: new Date(),
					id: activityId,
					label,
				},
			},
		},
	);
}
