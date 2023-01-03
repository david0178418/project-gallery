import { WithId } from 'mongodb';
import { WithStringId } from '.';
import { DbJournal, UiJournal } from './Journal';
import { DbUser, UiUser } from './User';

export
type DbProject = WithId<{
	createdDate: string;
	detail: string;
	lastJournalEntry?: Pick<DbJournal, '_id' | 'title'>;
	lastUpdatedDate: string | null;
	owner: Pick<DbUser, '_id' | 'username'>;
	projectCreatedDate: string;
	projectLastUpdatedDate: string;
	summary: string;
	title: string;
	images: Array<{
		url: string;
		description: string;
	}>;
}>;

export
type ProjectImage = DbProject['images'][number];

export
type UiProject = WithStringId<Omit<DbProject, 'owner' | 'lastJournalEntry'> & {
	owner: Pick<UiUser, '_id' | 'username'>;
	lastJournalEntry?: Pick<UiJournal, '_id' | 'title'>;
}>;

export
type WriteProject = Pick<UiProject, 'detail' | 'summary' | 'title' | 'images' | 'projectCreatedDate' | 'projectLastUpdatedDate'> & {
	_id?: string;
};
