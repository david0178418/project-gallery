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
	projects: {
		label: 'Projects',
		value: 'projects',
		path: (username: string) => Paths.UserGallery(username),
	},
	journals: {
		label: 'Journal Posts',
		value: 'journals',
		path: (useername: string) => Paths.UserGalleryJournals(useername),
	},
	about: {
		label: 'About',
		value: 'about',
		path: (username: string) => Paths.UserGalleryAbout(username),
	},
} as const;

interface Props {
	username: string;
}

export default function UserProfileTabs(props: Props) {
	const { username } = props;

	const rawSegment = useSelectedLayoutSegment() || '';
	const tab = rawSegment in TabPaths ?
		rawSegment :
		TabPaths.projects.value;

	return (
		<>
			<Tabs value={tab}>
				{Object.values(TabPaths).map(t => (
					<TabsList key={t.value}>
						<TabsTrigger value={t.value}>
							<Link href={t.path(username)}>
								{t.value}
							</Link>
						</TabsTrigger>
					</TabsList>
				))}
			</Tabs>
		</>
	);
}
