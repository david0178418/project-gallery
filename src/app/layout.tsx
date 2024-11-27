import '@styles/globals.css';

import { Roboto } from 'next/font/google';
import { ReactNode } from 'react';
import { AppName, BaseUrl } from '@common/constants';
import { LogoMain } from '@common/images';
import { urlJoin } from '@common/utils';
import { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import Providers from './providers';

export const experimental_ppr = true;

if(process.env.NODE_ENV === 'development') {
	const { setupDb } = await import('@server/mongodb/setup-db');
	await setupDb();
}

const SocialImageUrl = urlJoin(BaseUrl, LogoMain.src);

export const metadata: Metadata = {
	metadataBase: new URL(BaseUrl),
	title: AppName,
	twitter: {
		creator: '@justdavidg',
		card: 'summary_large_image',
		images: [{ url: SocialImageUrl }],
	},
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: BaseUrl,
		siteName: AppName,
		title: AppName,
		description: 'Your work, your story - Share it with the world on ProjectGallery.me!',
		images: [{ url: SocialImageUrl }],
	},
	description: 'Your work, your story - Share it with the world on ProjectGallery.me!',
};

const font = Roboto({
	weight: ['300', '400', '500', '700'],
	subsets: ['latin'],
	display: 'swap',
});

interface Props {
	children: ReactNode;
}

export default function RootLayout(props: Props) {
	return (
		<html lang="en" className={font.className}>
			<body>
				<Providers>
					{props.children}
				</Providers>
				<Analytics />
				<SpeedInsights/>
			</body>
		</html>
	);
}
