import { getServerSession } from '@server/auth-options';
import { ScrollContent } from '@components/scroll-content';
import ProjectCard from '@components/project-card';
import { SearchForm } from '@components/search-form';
import JournalsList from '@components/journals-list';
import { fetchJournals, fetchProjects } from '@server/queries';
import { dbJournalToUiJournal } from '@server/transforms';
import {
	Box,
	Container,
	Grid,
	Typography,
} from '@ui';

export default
async function HomePage() {
	const session = await getServerSession();
	const projects = (await fetchProjects());
	const journals = (await fetchJournals(session?.user.id)).map(dbJournalToUiJournal);

	return (
		<>
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
								key={p._id.toString()}
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
