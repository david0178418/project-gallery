import { ScrollContent } from '@components/scroll-content';
import SettingsTabs from './settings-tabs';
import { ReactNode } from 'react';

interface Props {
	children: ReactNode;
}

export default
function SettingsLayout(props: Props) {
	return (
		<ScrollContent
			header={
				<div className="border-b-2">
					<SettingsTabs />
				</div>
			}
		>
			{props.children}
		</ScrollContent>
	);
}
