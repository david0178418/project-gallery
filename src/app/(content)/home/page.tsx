import { ScrollContent } from '@components/scroll-content';
import { SearchForm } from '@components/search-form';
import { fetchJournals, fetchProjects } from '@server/queries';
import JournalCard from '@components/journal-card';
import ProjectCard from '@components/project-card';
import {
	Box,
	Grid,
	Typography,
} from '@ui';

export default
async function HomePage() {
	const journals = await fetchJournals();
	const projects = await fetchProjects();

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
							<ProjectCard project={p} />
						</Grid>
					))}
				</Grid>
				<Typography variant="h6">
					Journal Posts
				</Typography>
				{journals.map(j => (
					<Box
						padding={1}
						key={j._id.toString()}
					>
						<JournalCard journal={j} />
					</Box>
				))}
			</ScrollContent>
		</>
	);
}