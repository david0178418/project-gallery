import { ObjectId } from 'mongodb';

export
interface DbUserMeta {
	userId: ObjectId;
	created: string;
	lastLogin: string;
	emailValidated?: boolean;
}

export
type UiUserMeta = Omit<DbUserMeta, 'userId'> & {
	userId: string;
}
