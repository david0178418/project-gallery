import { PasswordSaltLength } from '@common/constants';
import { DbJournal, UiJournal } from '@common/types/Journal';
import {
	DbProject, UiProject, WriteProject,
} from '@common/types/Project';
import { pick } from '@common/utils';
import { hash } from 'bcryptjs';
import { WithId } from 'mongodb';

export
function passwordToHash(password: string) {
	return hash(password, PasswordSaltLength);
}

export
function dbProjectToUiProject(dbProject: WithId<DbProject>): UiProject {
	const uiProject = {
		...dbProject,
		owner: {
			_id: dbProject.owner._id.toString(),
			username: dbProject.owner.username.toString(),
		},
		lastJournalEntry: dbProject.lastJournalEntry && {
			_id: dbProject.lastJournalEntry._id.toString(),
			title: dbProject.lastJournalEntry.title.toString(),
		},
		_id: dbProject._id.toString(),
	};

	// remove undefined since it breaks serialization unless explicitly set to null
	if(!uiProject.lastJournalEntry) {
		delete uiProject.lastJournalEntry;
	}

	return uiProject;
}

export
function uiProjectToWriteProject(project: UiProject): WriteProject {
	return pick(project, 'detail', 'projectCreatedDate', 'projectLastUpdatedDate', 'summary', 'title', 'images');
}

export
function dbJournalToUiJournal(dbJournal: WithId<DbJournal>): UiJournal {
	const uiJournal: UiJournal = {
		...dbJournal,
		owner: {
			_id: dbJournal.owner._id.toString(),
			username: dbJournal.owner.username.toString(),
		},
		project: dbJournal.project && {
			_id: dbJournal.project._id.toString(),
			title: dbJournal.project.title.toString(),
		},
		_id: dbJournal._id.toString(),
	};

	// remove undefined since it breaks serialization unless explicitly set to null
	if(!uiJournal.project) {
		delete uiJournal.project;
	}

	return uiJournal;
}
