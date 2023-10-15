'use client';
import { Paths } from '@common/constants';
import { useRouter } from 'next/navigation';
import {
	useEffect,
	useState,
	useRef,
	useLayoutEffect,
	EffectCallback,
} from 'react';

export
function useRouteBackDefault(fallback: string = Paths.Home) {
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
