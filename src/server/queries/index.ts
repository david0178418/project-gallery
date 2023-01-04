import type { DbUser } from '@common/types/User';
import type { DbProject } from '@common/types/Project';
import { ObjectId, WithId } from 'mongodb';

import { getCollection } from '@server/mongodb';
import { DbCollections } from '@common/constants';
import { DbJournal } from '@common/types/Journal';

export
async function fetchUser(username: string): Promise<DbUser | null> {
	const usersCol = await getCollection(DbCollections.Users);
	const result = await usersCol.aggregate<WithId<DbUser>>([
		{ $match: { $expr: { $eq: [ { $toLower: '$username' }, username.toLowerCase() ] } } },
		{ $limit: 1 },
	]).toArray();

	return result[0] || null;
}

export
async function fetchProjects(): Promise<Array<WithId<DbProject>>> {
	const col = await getCollection(DbCollections.Projects);
	return col.aggregate<WithId<DbProject>>([
		{ $sort: { createdDate: -1 } },
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

export
async function fetchUserGallery(username: string): Promise<Array<WithId<DbProject>>> {
	const col = await getCollection(DbCollections.Projects);
	return col.aggregate<WithId<DbProject>>([
		{ $sort: { createdDate: -1 } },
		{ $match: { 'owner.username': username } },
		{ $limit: 20 },
	]).toArray();
}

export
async function fetchUserJournals(username: string, owner: boolean): Promise<Array<WithId<DbJournal>>> {
	const col = await getCollection(DbCollections.Journals);
	const ownerCondition = owner ?
		{} :
		{ publishedDate: { $ne: null } };

	return col.aggregate<WithId<DbJournal>>([
		{ $sort: { createdDate: -1 } },
		{
			$match: {
				'owner.username': username,
				...ownerCondition,
			},
		},
		{ $limit: 20 },
	]).toArray();
}
