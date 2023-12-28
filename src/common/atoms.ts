'use client';

import { atom, useSetAtom } from 'jotai';

export
const loadingAtom = atom(false);

export
function useSetLoading() {
	return useSetAtom(loadingAtom);
}
