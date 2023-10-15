import { Paths } from '@common/constants';
import { getServerSession } from '@server/auth-options';
import { redirect } from 'next/navigation';
import OneClickAuthClientLogin from './one-click-auth-client-login';

export default
async function OneClickAuthVerifyPage() {
	const session = await getServerSession();

	if(session) {
		redirect(Paths.Home);
	}

	return <OneClickAuthClientLogin />;
}
