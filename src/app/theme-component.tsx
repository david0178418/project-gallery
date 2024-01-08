'use client';

import theme from '@common/theme';
import { ThemeProvider } from '@mui/material/styles';
import { ReactNode } from 'react';

interface Props {
	children: ReactNode
}

export default function ThemeComponent({ children }: Props) {
	return (
		<ThemeProvider theme={theme}>
			{children}
		</ThemeProvider>
	);
}
