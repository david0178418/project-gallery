import CommonStuff from '@app/(content)/common-stuff';
import { ReactNode } from 'react';
import ThemeComponent from '@app/theme-component';

interface Props {
	children: ReactNode;
}

export default async function ProfileLayout(props: Props) {
	return (
		<ThemeComponent>
			{props.children}
			<CommonStuff/>
		</ThemeComponent>
	);
}
