import Head from 'next/head';
import { LoginBtn } from '@components/login-btn';
import { useIsLoggedIn } from '@common/hooks';
import { GetServerSideProps } from 'next';
import { getServerSession } from '@server/auth-options';
import { Container } from '@mui/material';
import { AppName } from '@common/constants';

interface Props {
	myData: any;
}

export
const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
	const session = await getServerSession(ctx.req, ctx.res);

	return {
		props: {
			session,
			myData: { someData: 'foo' },
		},
	};
};

export default function Home(props: Props) {
	const { myData } = props;
	const isLoggedIn = useIsLoggedIn();

	return (
		<Container>
			<Head>
				<title>{AppName}</title>
				<meta name="description" content={AppName} />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{!isLoggedIn && (
				<>
					<strong>
						Not logged in
					</strong>
					<LoginBtn />
				</>
			)}
			{isLoggedIn && (
				<strong>
					Logged In
				</strong>
			)}
			<pre>
				myData: {JSON.stringify(myData)}
			</pre>
		</Container>
	);
}
