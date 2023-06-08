import '@styles/globals.css';

import { Roboto } from 'next/font/google';
import { ReactNode } from 'react';
import Providers from './providers';

const font = Roboto({
	weight: ['300', '400', '500', '700'],
	subsets: ['latin'],
	display: 'swap',
});

interface Props {
	children: ReactNode;
	modal: ReactNode;
}

export default function RootLayout(props: Props) {
	return (
		<html lang="en" className={font.className}>
			<body>
				<Providers>
					{props.children}
					{props.modal}
				</Providers>
			</body>
		</html>
	);
}
