import Link from 'next/link';
import {
	Tab,
	Tabs,
} from '@mui/material';
import { Paths } from '@common/constants';

interface Props {
	activeTab: 'all' | 'journals' | 'projects';
}

export
function HomeSortTabs(props: Props) {
	const { activeTab } = props;

	return (
		<Tabs value={activeTab} variant="fullWidth">
			<Link
				legacyBehavior
				passHref
				// @ts-ignore Need to figure out how to handle this w/ new Link
				value="journals"
				href={Paths.Home}
			>
				<Tab
					LinkComponent="a"
					value="journals"
					label="Journal Posts"
					sx={{
						flex: 1,
						maxWidth: '50%',
					}}
				/>
			</Link>
			<Link
				legacyBehavior
				passHref
				// @ts-ignore Need to figure out how to handle this w/ new Link
				value="projects"
				href={{ query: { tab: 'projects' } }}
			>
				<Tab
					LinkComponent="a"
					value="projects"
					label="Projects"
					sx={{
						flex: 1,
						maxWidth: '50%',
					}}
				/>
			</Link>
		</Tabs>
	);
}
