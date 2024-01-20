import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import { MoreIcon } from '@components/icons';
import {
	ComponentProps,
	useState,
	useRef,
} from 'react';
import { IconButton } from '@mui/material';

interface Props extends ComponentProps<typeof Button> {
	anchorEl?: HTMLDivElement | null;
	menuProps? : Partial<ComponentProps<typeof Menu>>;
}

export
function DropdownMenu(props: Props) {
	const {
		children,
		onClick,
		anchorEl: externalAnchorEl,
		menuProps = {},
		...triggerProps
	} = props;

	const [isOpen, setIsOpen] = useState(false);
	const anchorEl = useRef(null);

	return (
		<>
			<IconButton
				{...triggerProps}
				ref={anchorEl}
				onClick={e => {
					setIsOpen(true);
					onClick?.(e);
				}}
			>
				<MoreIcon/>
			</IconButton>
			<Menu
				anchorEl={externalAnchorEl || anchorEl.current}
				onClick={() => setIsOpen(false)}
				onClose={() => setIsOpen(false)}
				open={isOpen}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				{...menuProps}
			>
				{children}
			</Menu>
		</>
	);
}
