import type { ReactNode } from 'react';
import {
	ListItemIcon,
	ListItemText,
} from '@ui';

interface Props {
	label: string;
	secondary?: string;
	children: ReactNode;
}

export
function RailButtonContent(props: Props) {
	const {
		label,
		secondary = '',
		children,
	} = props;
	return (
		<>
			<ListItemIcon>
				{children}
			</ListItemIcon>
			<ListItemText
				primary={label}
				secondary={secondary}
				sx={{
					display: {
						xs: 'none',
						md: 'inline',
					},
				}}
			/>
		</>
	);
}
