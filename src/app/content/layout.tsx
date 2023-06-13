import { PageFrame } from '@components/page-frame';
import { getServerSession } from '@server/auth-options';
import { ReactNode } from 'react';

interface Props {
	children: ReactNode;
}

export default
async function ContentLayout(props: Props) {
	const { children } = props;
	const session = await getServerSession();

	return (
		<PageFrame session={session}>
			{children}
		</PageFrame>
	);
}
