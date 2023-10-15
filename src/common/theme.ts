'use client';

import { createTheme } from '@ui';

const theme = createTheme({
	palette: {
		primary: {
			main: '#5271ff',
			light: 'rgb(116, 141, 255)',
			dark: 'rgb(57, 79, 178)',
			contrastText: '#fff',
		},
	},
	typography: { allVariants: { color: '#2B3445' } },
});

export default theme;
