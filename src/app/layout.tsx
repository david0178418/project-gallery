import '@styles/globals.css';

import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import Providers from './providers';
import { AppName, BaseUrl } from '@common/constants';
import { LogoMainImage } from '@common/images';
import { urlJoin } from '@common/utils';
import { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

const SocialImageUrl = urlJoin(BaseUrl, LogoMainImage.src);

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
		locale: 'en_IE',
		url: BaseUrl,
		siteName: AppName,
		title: AppName,
		description: 'Your work, your story - Share it with the world on ProjectGallery.me!',
		images: [{ url: SocialImageUrl }],
	},
	description: 'Your work, your story - Share it with the world on ProjectGallery.me!',
};

const font = Inter({ subsets: ['latin'] });

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
