import type { DbUser } from '@common/types/User';
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
