import { Box, Chip } from '@mui/material';
import { ComponentProps } from 'react';

type Props = ComponentProps<typeof Chip>;

export default
function Label(props: Props) {
	const {
		label,
		onClick,
	} = props;

	return (
		<Box
			marginBottom={1}
			marginRight={1}
			display="inline-block"
		>
			<Chip
				onClick={onClick}
				label={label}
			/>
		</Box>
	);
}
