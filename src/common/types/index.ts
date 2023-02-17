import { UserRoles } from '@common/constants';
import { User } from 'next-auth';
import type { ReactNode } from 'react';

export
type ApiResponse<T = any> = {
	ok: true;
	data: T;
} | {
	ok: false;
	errors?: string[];
}
export
interface CommonButtonProps {
	disabled?: boolean;
	fullWidth?: boolean;
	label?: string;
	href?: string;
	onClick?(): void;
	children?: ReactNode;
}

export
interface Settings {
	foo: 'bar';
}

export
interface ToastMesssage {
	message: ReactNode;
	delay?: number;
	onClose?(): void;
}

declare module 'next-auth' {
	interface User {
		id: string;
		username: string;
		role: Enum<typeof UserRoles>;
	}

	interface Session {
		user: User;
	}

}

declare module 'next-auth/jwt' {
	interface JWT {
		user: User;
	}
}

// Utility types
export
type AsyncFnReturnType<T extends (...args: any[]) => Promise<any>> = Awaited<ReturnType<T>>;

export
type Enum<T extends object> = T[keyof T];

export
type ReplacePropType<T, ToFind, ToReplace> = {
	[K in keyof T]: T[K] extends ToFind ? ToReplace : T[K]
}

export
type Nullable<T> = T | null;

export
type WithStringId<T> = Omit<T, '_id'> & {
	_id: string;
};
