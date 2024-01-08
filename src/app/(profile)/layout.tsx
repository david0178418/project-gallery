import CommonStuff from '@app/(content)/common-stuff';
import Link from 'next/link';
import { Paths } from '@common/constants';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { ReactNode } from 'react';
import ThemeComponent from '@app/theme-component';

interface Props {
	children: ReactNode;
}

export default async function FooLayout(props: Props) {
	return (
		<ThemeComponent>
			{props.children}
			<Box textAlign="center" paddingTop={5} paddingX={2} paddingBottom={15}>
				<Link href={Paths.Home}>
					<Button variant="outlined" size="small">
						Explore ProjectGallery.me
					</Button>
				</Link>
			</Box>
			<CommonStuff/>
		</ThemeComponent>
	);
}
