'use client';
import { Paths } from '@common/constants';
import { useSelectedLayoutSegment } from 'next/navigation';
import {
	Link, Tab, Tabs,
} from '@ui';

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

export default async function TabSection(props: Props) {
	const { username } = props;

	const section = useSelectedLayoutSegment();

	return (
		<Tabs value={section || 'projects'}>
			{Object.values(TabPaths).map(t => (
				<Tab
					key={t.value}
					href={t.path(username)}
					value={t.value}
					label={t.label}
					component={Link}
				/>
			))}
		</Tabs>
	);
}
