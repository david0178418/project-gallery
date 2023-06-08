import '@styles/globals.css';

import type { AppProps } from 'next/app';

import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@ui';
import { Session } from 'next-auth';
import { Layout } from '@components/layout';
import { Analytics } from '@vercel/analytics/react';
import { DefaultSeo } from 'next-seo';
import { AppName, BaseUrl } from '@common/constants';
import { urlJoin } from '@common/utils';
import theme from '@common/theme';
import { Roboto } from 'next/font/google';

const font = Roboto({
	weight: ['300', '400', '500', '700'],
	subsets: ['latin'],
	display: 'swap',
});

interface Props {
	session: Session | null;
	initialState: any;
}

// const CommonModals = dynamic(() => import('@common/common-stuff'), { ssr: false });
const imageUrl = urlJoin(BaseUrl, '/logo-main.png');

function App(props: AppProps<Props>) {
	const {
		Component,
		pageProps: {
			session,
			...pageProps
		},
	} = props;

	return (
		<div className={font.className}>
			<DefaultSeo
				openGraph={{
					type: 'website',
					locale: 'en_IE',
					url: BaseUrl,
					siteName: AppName,
					title: AppName,
					description: 'Your work, your story - Share it with the world on ProjectGallery.me!',
					images: [{ url: imageUrl }],
				}}
				twitter={{
					handle: '@justdavidg',
					cardType: 'summary_large_image',
				}}
			/>
			<Head>
				<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
				<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
				<meta
					name="viewport"
					content="initial-scale=1, width=device-width"
				/>
			</Head>
			<ThemeProvider theme={theme}>
				<SessionProvider session={session}>
					<Layout>
						<Component {...pageProps} />
					</Layout>
					{/* <CommonModals /> */}
				</SessionProvider>
			</ThemeProvider>
			<Analytics />
		</div>);
}

export default App;
