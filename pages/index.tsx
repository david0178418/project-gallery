import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getServerSession } from '@server/auth-options';
import { AppName } from '@common/constants';
import { ScrollContent } from '@components/scroll-content';
import ProjectCard from '@components/project-card';
import { SearchForm } from '@components/search-form';
import { UiProject } from '@common/types/Project';
import { fetchProjects } from '@server/queries';
import { dbProjectToUiProject } from '@server/transforms';
import { Box, Grid } from '@mui/material';
import { HomeSortTabs } from '@components/home-sort-tabs';

interface Props {
	activeTab: 'projects' | 'journals';
	projects: UiProject[];
}

export
const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
	const session = await getServerSession(ctx.req, ctx.res);
	const dbProjects = await fetchProjects() || [];

	const activeTab = ctx.query.tab === 'projects' ?
		'projects' :
		'journals';

	return {
		props: {
			session,
			activeTab,
			projects: dbProjects.map(dbProjectToUiProject),
		},
	};
};

export default function Home(props: Props) {
	const {
		activeTab,
		projects,
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
					{projects.map(p => (
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
				</Grid>
			</ScrollContent>
		</>
	);
}
