'use client';
import { Paths } from '@common/constants';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import {
	Tab,
	Tabs,
} from '@ui';

const TabPaths = {
	details: {
		label: 'Details',
		value: 'details',
		path: (projectId: string) => Paths.Project(projectId),
	},
	journals: {
		label: 'Journal',
		value: 'journals',
		path: (projectId: string) => Paths.ProjectJournals(projectId),
	},
	links: {
		label: 'Links',
		value: 'links',
		path: (projectId: string) => Paths.ProjectLinks(projectId),
	},
} as const;

interface Props {
	projectId: string;
}

export default
function ProjectTabs(props: Props) {
	const { projectId } = props;
	const rawSegment = useSelectedLayoutSegment() || '';
	const tab = rawSegment in TabPaths ?
		rawSegment :
		TabPaths.details.value;

	return (
		<Tabs value={tab}>
			{Object.values(TabPaths).map(t => (
				<Tab
					key={t.value}
					href={t.path(projectId)}
					value={t.value}
					label={t.label}
					component={Link}
				/>
			))}
		</Tabs>
	);
}
