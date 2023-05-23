'use client';

import '@styles/globals.css';

import { Roboto } from 'next/font/google';
import theme from '@common/theme';
import { ThemeProvider } from '@mui/material';
import { ReactNode } from 'react';

const font = Roboto({
	weight: ['300', '400', '500', '700'],
	subsets: ['latin'],
	display: 'swap',
});

interface Props {
	children: ReactNode
}

export default function RootLayout({ children }: Props) {
	return (
		<html lang="en" className={font.className}>
			<body>
				<ThemeProvider theme={theme}>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
