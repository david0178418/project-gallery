import { ScrollContent } from '@components/scroll-content';
import SettingsTabs from './settings-tabs';
import { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';

interface Props {
	children: ReactNode;
}

export default
function SettingsLayout(props: Props) {
	return (
		<ScrollContent
			header={
				<Box
					borderBottom={1}
					borderColor="divider"
				>
					<Alert severity="info">
						Pardon our dust.  This page is in the middle of a rework.
					</Alert>
					<SettingsTabs />
				</Box>
			}
		>
			{props.children}
		</ScrollContent>
	);
}
