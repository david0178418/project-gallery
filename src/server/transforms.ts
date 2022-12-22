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
		owner: {
			_id: dbProject.owner._id.toString(),
			username: dbProject.owner.username.toString(),
		},
		_id: dbProject._id.toString(),
	};
}
