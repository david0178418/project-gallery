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
	return {
		...dbProject,
		ownerId: dbProject.ownerId.toString(),
		_id: dbProject._id.toString(),
	};
}
