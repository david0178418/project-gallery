import { usePushToastMsg } from '@common/atoms';
import { AuthProviders, Paths } from '@common/constants';
import { useEffectOnce } from '@common/hooks';
import { exec } from '@common/utils';
import { getServerSession } from '@server/auth-options';
import { GetServerSideProps } from 'next';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

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
	const {
		replace,
		query: { k: key },
	} = useRouter();
	const pushToastMsg = usePushToastMsg();

	useEffectOnce(() => {
		if(!key) {
			return;
		}

		exec(async () => {
			const result = await signIn(AuthProviders.OneClick, {
				key,
				redirect: false,
			});

			if(!result?.ok) {
				pushToastMsg('Something went wrong. Try again.');
			}

			if(result?.error) {
				console.error(`One click error: ${result.error}`);
			}

			replace(Paths.Home);
		});
	});

	return (
		<>
			Logging you in...
		</>
	);
}
