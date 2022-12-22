import { ObjectId, WithId } from 'mongodb';
import { WithStringId } from '.';

export
type DbProject = WithId<{
	title: string;
	createdDate: string;
	ownerId: ObjectId;
	lastUpdatedDate: string;
	projectCreatedDate: string;
	projectLastUpdatedDate: string;
	summary: string;
	detail: string;
	titleImageUrl: string;
}>;

export
type UiProject = WithStringId<Omit<DbProject, 'ownerId'> & {
	ownerId: string;
}>;

export
type WriteProject = Pick<UiProject, 'detail' | 'summary' | 'title' | 'projectCreatedDate' | 'projectLastUpdatedDate'> & {
	_id?: string;
};
