'use client';
import { Box, Button } from '@ui';
import { ReactNode } from 'react';

interface Props {
	children: ReactNode;
	href?: string;
	onClick? (): void;
}

export default
function ProfileButton(props: Props) {
	return (
		<Box marginBottom={3} color="black">
			<Button
				{...props}
				fullWidth
				size="large"
				variant="outlined"
				color="inherit"
				sx={{
					maxWidth: 600,
					fontSize: 20,
				}}
			/>
		</Box>
	);
}
