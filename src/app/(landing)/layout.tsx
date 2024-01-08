import ThemeComponent from '@app/theme-component';
import { ReactNode } from 'react';

interface Props {
	children: ReactNode;
}

export default function LandingLayout(props: Props) {
	return (
		<ThemeComponent>
			{props.children}
		</ThemeComponent>
	);
}
