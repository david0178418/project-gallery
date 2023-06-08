import { Layout } from '@components/layout';
import type { ReactNode } from 'react';

interface Props {
	children: ReactNode;
}

export default
function HomeLayout(props: Props) {
	return (
		<Layout>
			{props.children}
		</Layout>
	);
}
