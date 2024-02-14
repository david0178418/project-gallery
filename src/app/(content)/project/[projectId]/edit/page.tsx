import BackButton from '@components/back-button';
import { ScrollContent } from '@components/scroll-content';
import { fetchProject } from '@server/queries';
import { MongoIdValidation } from '@server/validations';
import EditProjectForm from './edit-project.form';
import { DbProject, WriteProject } from '@common/types/Project';
import { nowISOString, pick } from '@common/utils';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Alert } from '@mui/material';

interface Props {
	params: {
		projectId: string;
	}
}

export default
async function ProjectEditPage(props: Props) {
	const { params: { projectId } } = props;

	const project = projectId ?
		await validateAndFetchProject(projectId) :
		newWriteProject();

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
					<Alert severity="info">
						Pardon our dust!  This page is in the middle of a rework.
					</Alert>
				</Box>
			}
		>
			<Container>
				<EditProjectForm
					project={'createdDate' in project ? dbProjectToWriteProject(project) : project}
				/>
			</Container>
		</ScrollContent>
	);
}

function dbProjectToWriteProject(project: DbProject): WriteProject {
	return {
		_id: project._id?.toString(),
		...pick(
			project,
			'description',
			'projectCreatedDate',
			'projectLastUpdatedDate',
			'labels',
			'customItems',
			'title',
			'images',
			'unlisted',
		),
	};
}

function newWriteProject(): WriteProject {
	const nowStr = nowISOString();
	return {
		description: '',
		title: '',
		images: [],
		projectCreatedDate: nowStr,
		projectLastUpdatedDate: nowStr,
		labels: [],
		customItems: [],
	};
}

async function validateAndFetchProject(projectId: string): Promise<DbProject | null> {
	const result = await MongoIdValidation.safeParseAsync(projectId);

	return result.success ?
		await fetchProject(projectId) :
		null;
}
