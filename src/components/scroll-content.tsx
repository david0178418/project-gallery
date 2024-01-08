import Box from '@mui/material/Box';
import type { ReactNode } from 'react';

interface Props {
	header?: ReactNode;
	children: ReactNode;
}

export
function ScrollContent(props: Props) {
	const {
		children,
		header,
	} = props;
	return (
		<Box
			display="flex"
			flexDirection="column"
			maxHeight="100%"
		>
			{header}
			<Box
				overflow="hidden auto"
				flex={1}
				paddingBottom={25}
			>
				{children}
			</Box>
		</Box>
	);
}
