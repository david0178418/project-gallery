import { ComponentProps } from 'react';
import { Button } from './ui/button';
import { ExpandLessIcon, ExpandMoreIcon } from './icons';

interface Props extends ComponentProps<typeof Button> {
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
		<Button {...passThroughProps}>
			{
				expanded ?
					<ExpandLessIcon/> :
					<ExpandMoreIcon/>
			}
		</Button>
	);
}
