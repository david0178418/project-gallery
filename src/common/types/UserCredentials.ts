import { z, ZodType } from 'zod';
import {
	PasswordMaxLength,
	PasswordMinLength,
	UsernameMaxLength,
	UsernameMinLength,
} from '@common/constants';

export
interface UserCredential {
	password: string;
	username: string;
}

export
const UsernameValidation = z
	.string()
	.min(UsernameMinLength)
	.max(UsernameMaxLength)
	.regex(/^[a-z0-9]+$/i);

export
const PasswordValidation = z
	.string()
	.min(PasswordMinLength)
	.max(PasswordMaxLength);

export
const UserCredentialValidation: ZodType<UserCredential> = z.object({
	username: UsernameValidation,
	password: PasswordValidation,
});
