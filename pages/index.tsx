import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getServerSession } from '@server/auth-options';
import { AppName } from '@common/constants';
import { ScrollContent } from '@components/scroll-content';
import ProjectCard from '@components/project-card';
import { SearchForm } from '@components/search-form';
import { UiProject } from '@common/types/Project';
import { UiJournal } from '@common/types/Journal';
import { fetchJournals, fetchProjects } from '@server/queries';
import { dbJournalToUiJournal, dbProjectToUiProject } from '@server/transforms';
import JournalsList from '@components/journals-list';
import {
	Box,
	Container,
	Grid,
	Typography,
} from '@mui/material';

interface Props {
	projects: UiProject[];
	journals: UiJournal[];
}

export
const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
	const session = await getServerSession(ctx.req, ctx.res);
	const projects = (await fetchProjects()).map(dbProjectToUiProject);
	const journals = (await fetchJournals()).map(dbJournalToUiJournal);

	return {
		props: {
			session,
			projects,
			journals,
		},
	};
};

export default function Home(props: Props) {
	const {
		projects,
		journals,
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
					</Box>
				}
			>
				<Container>
					<Typography variant="h6">
					Projects
					</Typography>
					<Grid padding={1} container spacing={1} >
						{projects.slice(0, 2).map(p => (
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
					<Typography variant="h6">
					Journal Posts
					</Typography>
					<JournalsList journals={journals} />
				</Container>
			</ScrollContent>
		</>
	);
}
