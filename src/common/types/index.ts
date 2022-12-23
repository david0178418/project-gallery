import { User } from 'next-auth';
import type { ReactNode } from 'react';

export
interface ApiResponse<T = any> {
	ok: boolean;
	data?: T;
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
type Nullable<T> = T | null;

export
type WithStringId<T> = Omit<T, '_id'> & {
	_id: string;
};
