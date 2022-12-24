import { PasswordSaltLength } from '@common/constants';
import { DbProject, UiProject } from '@common/types/Project';
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
