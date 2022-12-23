import { WithId } from 'mongodb';
import { WithStringId } from '.';
import { DbUser } from './User';

export
type DbProject = WithId<{
	createdDate: string;
	detail: string;
	lastUpdatedDate: string;
	owner: Pick<DbUser, '_id' | 'username'>;
	projectCreatedDate: string;
	projectLastUpdatedDate: string;
	summary: string;
	title: string;
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
