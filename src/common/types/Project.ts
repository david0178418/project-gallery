import { WithId } from 'mongodb';
import { WithStringId } from '.';
import { DbUser } from './User';

export
type DbProject = WithId<{
	title: string;
	createdDate: string;
	owner: Pick<DbUser, '_id' | 'username'>;
	lastUpdatedDate: string;
	projectCreatedDate: string;
	projectLastUpdatedDate: string;
	summary: string;
	detail: string;
	titleImageUrl: string;
}>;

export
type UiProject = WithStringId<Omit<DbProject, 'owner'> & {
	owner: WithStringId<Pick<DbUser, 'username'>>;
}>;

export
type WriteProject = Pick<UiProject, 'detail' | 'summary' | 'title' | 'projectCreatedDate' | 'projectLastUpdatedDate'> & {
	_id?: string;
};
