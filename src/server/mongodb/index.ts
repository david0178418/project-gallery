import { DbCollections } from '@common/constants';
import { setupDb } from './setup-db';
import { DbTextGram } from '@common/types/TextGram';
import { DbUser } from '@common/types/User';
import { DbUserMeta } from '@common/types/UserMeta';
import { Enum } from '@common/types';
import { DbProject } from '@common/types/Project';
import { DbJournal } from '@common/types/Journal';
import { DbUserProfile } from '@common/types/UserProfile';
import {
	Collection,
	Db,
	MongoClient,
	MongoClientOptions,
} from 'mongodb';

type DbCollectionsEnum = Enum<typeof DbCollections>;

const MongoDbName = process.env.DB_NAME || 'awesome-default-db';
const uri = process.env.MONGODB_URI || '';
const options: MongoClientOptions = {};

let dbClient;
let dbClientPromise: Promise<Db>;

if (!process.env.MONGODB_URI) {
	throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
	// In development mode, use a global variable so that the value
	// is preserved across module reloads caused by HMR (Hot Module Replacement).
	// @ts-ignore
	if (!global._mongoClientPromise) {
		dbClient = new MongoClient(uri, options);
		// @ts-ignore
		global._mongoClientPromise = dbClient.connect()
			.then((client) => client.db(MongoDbName));
	}
	// @ts-ignore
	dbClientPromise = global._mongoClientPromise;
} else {
	// In production mode, it's best to not use a global variable.
	dbClient = new MongoClient(uri, options);
	dbClientPromise = dbClient.connect()
		.then((client) => client.db(MongoDbName));
}

/* eslint-disable @typescript-eslint/indent */
type CollectionType<T> =
	T extends typeof DbCollections.Grams ? DbTextGram :
	T extends typeof DbCollections.Journals ? DbJournal :
	T extends typeof DbCollections.Projects ? DbProject :
	T extends typeof DbCollections.Users ? DbUser :
	T extends typeof DbCollections.UsersMeta ? DbUserMeta :
	T extends typeof DbCollections.UserProfiles ? DbUserProfile :
	never;
/* eslint-enable @typescript-eslint/indent */

async function getCollection<T extends DbCollectionsEnum>(collection: T): Promise<Collection<CollectionType<T>>> {
	const db = await dbClientPromise;

	return db.collection<CollectionType<T>>(collection);
}

if(process.env.NODE_ENV === 'development') {
	setupDb();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export {
	dbClientPromise,
	getCollection,
};
