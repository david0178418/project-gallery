import { Paths } from '@common/constants';
import { getServerSession } from '@server/auth-options';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

interface Props {
	children: ReactNode;
}

export default
async function Layout(props: Props) {

	const session = await getServerSession();

	if(session) {
		redirect(Paths.UserGallery(session.user.username));
	}

	return (
		<>
			{props.children}
		</>
	);
}
