'use client';

import '@styles/globals.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import theme from '@common/theme';
import { ThemeProvider } from '@mui/material';
import { ReactNode } from 'react';

interface Props {
	children: ReactNode
}

export default function RootLayout({ children }: Props) {
	return (
		<html lang="en">
			<body>
				<ThemeProvider theme={theme}>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
