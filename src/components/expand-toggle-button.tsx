import { IconButton } from '@mui/material';
import {
	ExpandLessIcon,
	ExpandMoreIcon,
} from './icons';

interface Props {
	expanded?: boolean;
	onClick(): void;
}

export
function ExpandedToggleButton(props: Props) {
	const {
		onClick,
		expanded,
	} = props;

	return (
		<IconButton onClick={onClick}>
			{
				expanded ?
					<ExpandLessIcon/> :
					<ExpandMoreIcon/>
			}
		</IconButton>
	);
}
