'use client';

import theme from '@common/theme';
import { ThemeProvider } from '@ui';
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

interface Props {
	children: ReactNode
}

export default function Providers({ children }: Props) {
	return (
		<ThemeProvider theme={theme}>
			<SessionProvider>
				{children}
			</SessionProvider>
		</ThemeProvider>
	);
}
