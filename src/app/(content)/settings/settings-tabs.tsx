'use client';
import { Paths } from '@common/constants';
import { useSelectedLayoutSegment } from 'next/navigation';
import Link from 'next/link';
import {
	Tabs,
	TabsList,
	TabsTrigger,
} from '@/components/ui/tabs';

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
		<>
			<Tabs value={tab}>
				{Object.values(TabPaths).map(t => (
					<TabsList key={t.value}>
						<TabsTrigger value={t.value}>
							<Link href={t.path}>
								{t.value}
							</Link>
						</TabsTrigger>
					</TabsList>
				))}
			</Tabs>
		</>
	);
}
