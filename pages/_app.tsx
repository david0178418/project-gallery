import '@styles/globals.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import type { AppProps } from 'next/app';

import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { createTheme, ThemeProvider } from '@mui/material';
import { Session } from 'next-auth';
import dynamic from 'next/dynamic';
import { Layout } from '@components/layout';
import { Analytics } from '@vercel/analytics/react';
import { DefaultSeo } from 'next-seo';
import { AppName, BaseUrl } from '@common/constants';
import { urlJoin } from '@common/utils';

interface Props {
	session: Session | null;
	initialState: any;
}

const theme = createTheme({
	palette: {
		primary: {
			main: '#5271ff',
			light: 'rgb(116, 141, 255)',
			dark: 'rgb(57, 79, 178)',
			contrastText: '#fff',
		},
	},
});

const CommonModals = dynamic(() => import('@common/common-stuff'), { ssr: false });
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
		<>
			<DefaultSeo
				openGraph={{
					type: 'website',
					locale: 'en_IE',
					url: BaseUrl,
					siteName: AppName,
					title: AppName,
					description: 'Your work, your story - Share it with the world on ProjectGallery.me!',
					images: [{
						url: imageUrl,
						width: 500,
						height: 500,
						type: 'image/png',
					}],
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
					<CommonModals />
				</SessionProvider>
			</ThemeProvider>
			<Analytics />
		</>);
}

export default App;
