import { ScrollContent } from '@components/scroll-content';
import SettingsTabs from './settings-tabs';
import { ReactNode } from 'react';
import { Box } from '@ui';

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
					<SettingsTabs />
				</Box>
			}
		>
			{props.children}
		</ScrollContent>
	);
}
