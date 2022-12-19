import type { ReactNode } from 'react';
import { UserRoles } from './constants';

export
interface ApiResponse<T = any> {
	ok: boolean;
	data?: T;
	errors?: string[];
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

interface User {
	id: string;
	email: string;
	username: string;
	role: Enum<typeof UserRoles>;
}

declare module 'next-auth' {
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
