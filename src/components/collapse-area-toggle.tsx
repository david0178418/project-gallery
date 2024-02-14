import { ProfileButton } from '@components/profile-button';
import Collapse from '@mui/material/Collapse';
import { ComponentProps, ReactNode } from 'react';
import { CloseIcon } from '@components/icons';

interface Props {
	icon: any;
	active?: boolean;
	show?: boolean;
	children: ReactNode;
	collapseSx?: ComponentProps<typeof Collapse>['sx']
	label: string;
	onButtonClick(): void;
	onTransitionEnd?(): void;
}

export default
function CollpaseAreaToggle(props: Props) {
	const {
		label,
		onButtonClick,
		show,
		icon: Icon,
		active,
		onTransitionEnd,
		children,
		collapseSx = {},
	} = props;
	return (
		<>
			<ProfileButton
				onClick={onButtonClick}
				icon={
					active ?
						CloseIcon :
						Icon
				}
			>
				{label}
			</ProfileButton>
			<Collapse
				in={show}
				onTransitionEnd={onTransitionEnd}
				sx={{
					marginLeft: {
						xs: 2,
						md: 10,
					},
					...collapseSx,
				}}
			>
				{children}
			</Collapse>
		</>
	);
}
