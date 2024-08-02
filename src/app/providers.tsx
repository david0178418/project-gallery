'use client';
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'jotai';

interface Props {
	children: ReactNode
}

export default function Providers({ children }: Props) {
	return (
		<Provider>
			<SessionProvider>
				{children}
			</SessionProvider>
		</Provider>
	);
}
