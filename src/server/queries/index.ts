import type { DbUser } from '@common/types/User';
import type { DbProject } from '@common/types/Project';
import type { WithId } from 'mongodb';

import { getCollection } from '@server/mongodb';
import { DbCollections } from '@common/constants';

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
async function fetchUserGallery(username: string): Promise<Array<WithId<DbProject>>> {
	const col = await getCollection(DbCollections.Projects);
	return col.aggregate<WithId<DbProject>>([
		{ $sort: { createdDate: -1 } },
		{ $match: { 'owner.username': username } },
		{ $limit: 20 },
	]).toArray();
}
