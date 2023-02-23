import { AuthProviders, Paths } from '@common/constants';
import { exec } from '@common/utils';
import { getServerSession } from '@server/auth-options';
import { GetServerSideProps } from 'next';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface Props {
	key: string;
}

export
const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
	const session = await getServerSession(ctx.req, ctx.res);
	const key = ctx.query?.k;

	if(session || !key || typeof key !== 'string') {
		return {
			redirect: {
				permanent: false,
				destination: Paths.Home,
			},
		};
	}

	return { props: { key } };
};

export default
function OneClickAuthVerifyPage() {
	const { query: { k: key } } = useRouter();

	useEffect(() => {
		if(!key) {
			return;
		}

		exec(async () => {
			await signIn(AuthProviders.OneClick, { key });
		});
	}, [key]);

	return (
		<>
			{key}
		</>
	);
}
