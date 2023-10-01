'use client';
import { Paths } from '@common/constants';
import { useSelectedLayoutSegment } from 'next/navigation';
import { Tab, Tabs } from '@ui';
import Link from 'next/link';

const TabPaths = {
	profile: {
		label: 'Profile',
		value: 'profile',
		path: Paths.Settings,
	},
	['update-pw']: {
		label: 'Update Password',
		value: 'update-pw',
		path: Paths.SettingsUpdatePw,
	},
} as const;

export default function SettingsTabs() {
	const rawSegment = useSelectedLayoutSegment() || '';
	const tab = rawSegment in TabPaths ?
		rawSegment :
		TabPaths.profile.value;

	return (
		<Tabs value={tab}>
			{Object.values(TabPaths).map(t => (
				<Tab
					key={t.value}
					href={t.path}
					value={t.value}
					label={t.label}
					component={Link}
				/>
			))}
		</Tabs>
	);
}
