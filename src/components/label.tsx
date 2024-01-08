import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { ComponentProps } from 'react';

type Props = ComponentProps<typeof Chip>;

export default
function Label(props: Props) {
	return (
		<Box
			marginBottom={1}
			marginRight={1}
			display="inline-block"
		>
			<Chip {...props} />
		</Box>
	);
}
