import BackButton from '@components/back-button';
import { ScrollContent } from '@components/scroll-content';
import { fetchProject } from '@server/queries';
import { MongoIdValidation } from '@server/validations';
import EditProjectForm from './edit-project.form';
import {
	Box,
	Container,
	Typography,
} from '@ui';
import { DbProject, WriteProject } from '@common/types/Project';
import { pick } from '@common/utils';

interface Props {
	params: {
		projectId: string;
	}
}

export default
async function ProjectEditPage(props: Props) {
	const { params: { projectId } } = props;
	const result = await MongoIdValidation.safeParseAsync(projectId);

	if(!result.success) {
		return { props: { project: null } };
	}

	const id = result.data;
	const project = await fetchProject(id);

	if(!project) {
		return (
			<Typography>
				Invalid Project
			</Typography>
		);
	}

	const { title } = project;

	return (
		<ScrollContent
			header={
				<Box sx={{
					paddingTop: 1,
					paddingBottom: 2,
				}}>
					<Typography variant="h5" component="div" gutterBottom>
						{/** TODO Capture direct links and send them to home page */}
						<BackButton />
						{title}
					</Typography>
				</Box>
			}
		>
			<Container>
				<EditProjectForm
					project={uiProjectToWriteProject(project)}
				/>
			</Container>
		</ScrollContent>
	);
}

function uiProjectToWriteProject(project: DbProject): WriteProject {
	return {
		_id: project._id?.toString(),
		...pick(
			project,
			'description',
			'projectCreatedDate',
			'projectLastUpdatedDate',
			'labels',
			'links',
			'title',
			'images',
			'unlisted',
		),
	};
}
