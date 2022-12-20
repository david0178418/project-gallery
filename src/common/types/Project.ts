import { WithId } from 'mongodb';
import { WithStringId } from '.';
import { UiUser } from './User';

export
type DbProject = WithId<{
	title: string;
	created: string;
	createdBy: Pick<UiUser, '_id' | 'username'>;
	lastUpdated: string;
	projectCreated: string;
	projectLastUpdated: string;
	summary: string;
	detail: string;
	titleImageUrl: string;
}>;

export
type UiProject = WithStringId<DbProject>;
