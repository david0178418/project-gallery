import CommonStuff from '@app/(content)/common-stuff';
import Link from 'next/link';
import { Paths } from '@common/constants';
import { Box, Button } from '@ui';
import { ReactNode } from 'react';

interface Props {
	children: ReactNode;
}

export default async function FooLayout(props: Props) {
	return (
		<>
			{props.children}
			<Box textAlign="center" paddingTop={5} paddingX={2} paddingBottom={15}>
				<Link href={Paths.Home}>
					<Button variant="outlined" size="small">
						Explore ProjectGallery.me
					</Button>
				</Link>
			</Box>
			<CommonStuff/>
		</>
	);
}
