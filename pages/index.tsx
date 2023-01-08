import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getServerSession } from '@server/auth-options';
import { AppName } from '@common/constants';
import { ScrollContent } from '@components/scroll-content';
import ProjectCard from '@components/project-card';
import { SearchForm } from '@components/search-form';
import { UiProject } from '@common/types/Project';
import { Box, Grid } from '@mui/material';
import { HomeSortTabs } from '@components/home-sort-tabs';
import { UiJournal } from '@common/types/Journal';
import { fetchJournals, fetchProjects } from '@server/queries';
import { dbJournalToUiJournal, dbProjectToUiProject } from '@server/transforms';
import JournalCard from '@components/journal-card';

type Props = {
	activeTab: 'projects';
	items: UiProject[];
} | {
	activeTab: 'journals';
	items: UiJournal[];
};

export
const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
	const session = await getServerSession(ctx.req, ctx.res);

	const data = ctx.query.tab === 'projects' ?
		{
			activeTab: 'projects' as const,
			items: (await fetchProjects()).map(dbProjectToUiProject),
		} : {
			activeTab: 'journals' as const,
			items: (await fetchJournals()).map(dbJournalToUiJournal),
		};

	return {
		props: {
			session,
			...data,
		},
	};
};

export default function Home(props: Props) {
	const {
		activeTab,
		items,
	} = props;

	return (
		<>
			<Head>
				<title>{AppName}</title>
				<meta name="description" content={AppName} />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<ScrollContent
				header={
					<Box
						sx={{
							paddingTop: 1,
							paddingBottom: 1,
						}}
					>
						<Box
							paddingBottom={1}
							sx={{
								paddingLeft: {
									xs: 2,
									sm: 10,
									md: 15,
									lg: 20,
								},
								paddingRight: {
									xs: 2,
									sm: 10,
									md: 15,
									lg: 20,
								},
							}}
						>
							<SearchForm />
						</Box>
						<HomeSortTabs
							activeTab={activeTab}
						/>
					</Box>
				}
			>
				<Grid padding={1} container spacing={1} >
					{activeTab === 'projects' && items.map(p => (
						<Grid
							key={p._id}
							item
							xs={12}
							md={6}
						>
							<ProjectCard
								project={p}
							/>
						</Grid>
					))}
					{activeTab === 'journals' && items.map(j => (
						<Grid
							key={j._id}
							item
							xs={12}
							md={6}
						>
							<JournalCard
								journal={j}
							/>
						</Grid>
					))}
				</Grid>
			</ScrollContent>
		</>
	);
}
