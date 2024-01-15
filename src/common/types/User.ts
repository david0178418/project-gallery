import { Enum, WithStringId } from '@common/types';
import { WithId } from 'mongodb';
import { z } from 'zod';
import {
	UserRoles,
	UsernameMaxLength,
	UsernameMinLength,
} from '@common/constants';

export
type DbUser = WithId<{
	role: Enum<typeof UserRoles>;
	email: string;
	username: string;
	displayName: string;
	usernameLower: string;
	hash: string,
}>;

export
type UiUser = WithStringId<DbUser>;

export
const DisplayNameValidation = z
	.string()
	.min(UsernameMinLength, `Must be at least ${UsernameMinLength} characters.`)
	.max(UsernameMaxLength, `Can be no more than ${UsernameMaxLength} characters.`);
