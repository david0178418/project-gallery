import { UserRoles } from '@common/constants';
import { Enum, WithStringId } from '@common/types';
import { WithId } from 'mongodb';

export
type DbUser = WithId<{
	role: Enum<typeof UserRoles>;
	email: string;
	username: string;
	usernameLower: string;
	hash: string,
}>;

export
type UiUser = WithStringId<DbUser>;
