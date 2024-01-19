import { z } from 'zod';
import {
	PasswordMaxLength,
	PasswordMinLength,
	UsernameMaxLength,
	UsernameMinLength,
} from '@common/constants';

export
interface UserLoginCredential {
	password: string;
	usernameOrEmail: string;
}

export
const EmailValidation = z
	.string()
	.email()
	.min(5)
	.transform(s => s.toLocaleLowerCase());

export
const UsernameValidation = z
	.string()
	.min(UsernameMinLength, `Username must be at least ${UsernameMinLength} characters.`)
	.max(UsernameMaxLength, `Username must be no more than ${UsernameMaxLength} characters.`)
	.regex(/^[a-z][a-z0-9]*$/i, 'Username must start with a letter and contain only letters and numbers');

export
const UsernameOrEmailValidation = z.union([UsernameValidation, EmailValidation]);

export
const PasswordValidation = z
	.string()
	.min(PasswordMinLength)
	.max(PasswordMaxLength);
