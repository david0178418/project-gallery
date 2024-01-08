import IconButton from '@mui/material/IconButton';
import { ComponentProps } from 'react';
import {
	ExpandLessIcon,
	ExpandMoreIcon,
} from './icons';

interface Props extends ComponentProps<typeof IconButton> {
	expanded?: boolean;
	onClick(): void;
}

export
function ExpandedToggleButton(props: Props) {
	const {
		expanded,
		...passThroughProps
	} = props;

	return (
		<IconButton {...passThroughProps}>
			{
				expanded ?
					<ExpandLessIcon/> :
					<ExpandMoreIcon/>
			}
		</IconButton>
	);
}
