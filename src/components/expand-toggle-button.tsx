import { IconButton } from '@mui/material';
import { ComponentProps } from 'react';
import {
	ExpandLessIcon,
	ExpandMoreIcon,
} from './icons';

type Props = ComponentProps<typeof IconButton> & {
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
