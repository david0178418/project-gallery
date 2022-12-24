import { WithId } from 'mongodb';
import { WithStringId } from '.';
import { DbProject } from './Project';
import { DbUser, UiUser } from './User';

export
type DbJournal = WithId<{
	body: string;
	publishedDate: string | null;
	lastUpdatedDate: string | null;
	owner: Pick<DbUser, '_id' | 'username'>;
	project?: Pick<DbProject, '_id' | 'title'>;
	title: string;
}>;

export
type UiJournal = WithStringId<Omit<DbJournal, 'owner'> & {
	owner: Pick<UiUser, '_id' | 'username'>;
}>;

export
type WriteJournal = Pick<UiJournal, 'title' | 'body'> & {
	_id?: string;
	projectId?: string | null;
	publish?: boolean;
};
