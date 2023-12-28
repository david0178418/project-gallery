'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { LoadingContextProvider } from '@components/loader';

interface Props {
	children: ReactNode
}

export default function Providers({ children }: Props) {
	return (
		<SessionProvider>
			<LoadingContextProvider>
				{children}
			</LoadingContextProvider>
		</SessionProvider>
	);
}
