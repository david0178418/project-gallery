'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Paths, UserRoles } from '@common/constants';
import { usePathname, useSearchParams } from 'next/navigation';
import {
	useEffect,
	useState,
	useRef,
	useLayoutEffect,
	useCallback,
	EffectCallback,
} from 'react';

export
function useIsLoggedIn() {
	const { status } = useSession();

	return status === 'authenticated';
}

export
function useIsLoggedOut() {
	const { status } = useSession();
	return status === 'unauthenticated';
}

export
function useUser() {
	const session = useSession();

	return session.data?.user || null;
}

export
function useIsAdmin() {
	const { data } = useSession();

	return data?.user.role === UserRoles.Admin;
}

export
function useQueryParam(key: string) {
	const searchParams = useSearchParams();
	const params = new URLSearchParams(searchParams?.toString());

	return params.get(key);
}

export
function useUpdateQueryParam() {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const createUrl = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams?.toString());
			params.set(name, value);

			return `${pathname}?${params.toString()}`;
		},
		[searchParams],
	);

	return createUrl;
}

export
function useRefreshPage() {
	const {
		replace,
		asPath,
	} = useRouter();

	return () => replace(asPath);
}

export
function useRouteBackDefault(fallback = Paths.Home) {
	const router = useRouter();

	return () => {
		if(document.referrer.startsWith(location.origin)) {
			router.back();
		} else {
			router.replace(fallback);
		}
	};
}

export
function useDebounce<T>(value: T, delay: number) {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}

export
// Source: https://usehooks-ts.com/react-hook/use-effect-once
function useEffectOnce(effect: EffectCallback) {
	useEffect(effect, []);
}

export
function useDebouncedCallback<T>(value: T, delay: number, callback: () => void,) {
	const debouncedValue = useDebounce(value, delay);

	useEffect(() => {
		callback();
	}, [debouncedValue]);
}

export
// Source: https://usehooks.com/useToggle/
function useToggle(initialState = false) {
	// Initialize the state
	const [state, setState] = useState(initialState);

	// Define and memorize toggler function in case we pass down the component,
	// This function change the boolean value to it's opposite value
	const toggle = useCallback(() => setState(s => !s), []);

	return [state, toggle];
}

export
// Source: https://usehooks-ts.com/react-hook/use-isomorphic-layout-effect
function useTimeout(callback: () => void, delay: number | null) {
	const savedCallback = useRef(callback);

	// Remember the latest callback if it changes.
	useLayoutEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	// Set up the timeout.
	useEffect(() => {
		// Don't schedule if no delay is specified.
		// Note: 0 is a valid value for delay.
		if (!delay && delay !== 0) {
			return;
		}

		const id = setTimeout(() => savedCallback.current(), delay);

		return () => clearTimeout(id);
	}, [delay]);
}
