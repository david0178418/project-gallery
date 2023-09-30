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

type TabPath = keyof typeof TabPaths;

interface Props {
	projectId: string;
}

export default
function ProjectTabs(props: Props) {
	const { projectId } = props;
	const rawPath = useSelectedLayoutSegment();
	const subPath = TabPaths[rawPath as TabPath]?.value || TabPaths.details.value;

	return (
		<Tabs value={subPath}>
			{Object.values(TabPaths).map(t => (
				<Link
					key={t.value}
					href={t.path(projectId)}
					legacyBehavior
					passHref
					// @ts-ignore
					value={t.value}
				>
					<Tab label={t.label} value={t.value} />
				</Link>
			))}
		</Tabs>
	);
}
