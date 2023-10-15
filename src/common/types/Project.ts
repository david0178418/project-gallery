import { WithId } from 'mongodb';
import { WithStringId } from '.';
import { DbJournal, UiJournal } from './Journal';
import { DbUser, UiUser } from './User';

export
type DbProject = WithId<{
	createdDate: string;
	description: string;
	lastJournalEntry?: Pick<DbJournal, '_id' | 'title'>;
	lastUpdatedDate: string | null;
	owner: Pick<DbUser, '_id' | 'username'>;
	projectCreatedDate: string;
	projectLastUpdatedDate: string;
	title: string;
	unlisted?: boolean;
	images: Array<{
		url: string;
		description: string;
	}>;
	labels: Array<{
		label: string;
	}>;
	links: Array<{
		label: string;
		url: string;
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
type WriteProject = Pick<UiProject, 'description' | 'title' | 'images' | 'projectCreatedDate' | 'projectLastUpdatedDate' | 'labels' | 'links' | 'unlisted'> & {
	_id?: string;
};
