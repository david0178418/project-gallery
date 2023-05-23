'use client';
import '@styles/globals.css';

import theme from '@common/theme';
import { ThemeProvider } from '@mui/material';
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

interface Props {
	children: ReactNode
}

export default
function Providers({ children }: Props) {
	return (
		<ThemeProvider theme={theme}>
			<SessionProvider>
				{children}
			</SessionProvider>
		</ThemeProvider>
	);
}
