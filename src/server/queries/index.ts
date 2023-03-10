import type { DbUser } from '@common/types/User';
import type { DbProject } from '@common/types/Project';
import { ObjectId, WithId } from 'mongodb';

import { getCollection } from '@server/mongodb';
import { DbCollections } from '@common/constants';
import { DbJournal } from '@common/types/Journal';
import { DbUserProfile } from '@common/types/UserProfile';
import { DbUserGalleryOrder } from '@common/types/UserGalleryOrder';
import { add } from 'date-fns';
import {
	makeId,
	nowISOString,
} from '@common/utils';

export
async function fetchUser(usernameOrEmail: string): Promise<DbUser | null> {
	const col = await getCollection(DbCollections.Users);
	const result = await col.aggregate<WithId<DbUser>>([
		{
			$match: {
				$or: [
					{ usernameLower: usernameOrEmail.toLocaleLowerCase() },
					{ email: usernameOrEmail },
				],
			},
		},
		{ $limit: 1 },
	]).toArray();

	return result[0] || null;
}

export
async function createUserLoginKey(email: string) {
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
	const col = await getCollection(DbCollections.Projects);
	return col.aggregate<WithId<DbProject>>([
		{ $match: { unlisted: { $ne: true } } },
		{ $sort: { lastUpdatedDate: -1 } },
		{ $limit: 20 },
	]).toArray();
}

export
async function fetchJournals(ownerId = ''): Promise<Array<WithId<DbJournal>>> {
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
async function fetchUserProfileByUsername(username: string): Promise<DbUserProfile | null> {
	const col = await getCollection(DbCollections.UserProfiles);

	return col.findOne({ username: username.toLocaleLowerCase() });
}

export
async function fetchProjectJournals(projectId: string, ownerId = ''): Promise<Array<WithId<DbJournal>>> {
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
	const col = await getCollection(DbCollections.Projects);
	return col.aggregate<WithId<DbProject>>([
		{ $sort: { title: 1 } },
		{ $match: { 'owner._id': new ObjectId(userId) } },
	]).toArray();
}

export
async function fetchProject(id: string): Promise<WithId<DbProject> | null> {
	const col = await getCollection(DbCollections.Projects);

	return col.findOne({ _id: new ObjectId(id) });
}

export
async function fetchJournal(id: string): Promise<WithId<DbJournal> | null> {
	const col = await getCollection(DbCollections.Journals);

	return col.findOne({ _id: new ObjectId(id) });
}

const DocPlaceholder = 'docTemp';

export
async function fetchUserGallery(username: string): Promise<Array<WithId<DbProject>>> {
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
async function fetchUserGalleryOrderByUsername(username: string): Promise<WithId<DbUserGalleryOrder> | null> {
	const col = await getCollection(DbCollections.UserGalleryOrder);
	return col.findOne({ usernameLower: username });
}

export
async function fetchUserGalleryOrder(userId: string): Promise<WithId<DbUserGalleryOrder> | null> {
	const col = await getCollection(DbCollections.UserGalleryOrder);
	return col.findOne({ _id: new ObjectId(userId) });
}

export
async function fetchUserJournals(username: string, owner: boolean): Promise<Array<WithId<DbJournal>>> {
	const col = await getCollection(DbCollections.Journals);
	const ownerCondition = owner ?
		{} :
		{ publishedDate: { $ne: null } };

	return col.aggregate<WithId<DbJournal>>([
		{ $sort: { publishedDate: -1 } },
		{
			$match: {
				'owner.username': username,
				...ownerCondition,
			},
		},
		{ $limit: 20 },
	]).toArray();
}

export
async function updateLastLogin(id: ObjectId | string) {
	const col = await getCollection(DbCollections.UsersMeta);

	await col.updateOne(
		{ _id: new ObjectId(id) },
		{ $set: { lastLogin: nowISOString() } },
	);
}
