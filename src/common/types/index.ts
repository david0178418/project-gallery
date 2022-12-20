import type { ReactNode } from 'react';
import type { UiUser } from './User';

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

declare module 'next-auth' {
	interface Session {
		user: UiUser;
	}

}

declare module 'next-auth/jwt' {
	interface JWT {
		user: UiUser;
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
