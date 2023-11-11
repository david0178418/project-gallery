import BackButton from '@components/back-button';
import { ScrollContent } from '@components/scroll-content';
import { fetchProject } from '@server/queries';
import { MongoIdValidation } from '@server/validations';
import EditProjectForm from './edit-project.form';
import { DbProject, WriteProject } from '@common/types/Project';
import { nowISOString, pick } from '@common/utils';

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
			<div>
				Invalid Project
			</div>
		);
	}

	const { title } = project;

	return (
		<ScrollContent
			header={
				<div className="pt-2 pb-2">
					<div className="font-bold mb-2">
						{/** TODO Capture direct links and send them to home page */}
						<BackButton />
						{title}
					</div>
				</div>
			}
		>
			<div className="container">
				<EditProjectForm
					project={'createdDate' in project ? dbProjectToWriteProject(project) : project}
				/>
			</div>
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
			'links',
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
		links: [],
	};
}

async function validateAndFetchProject(projectId: string): Promise<DbProject | null> {
	const result = await MongoIdValidation.safeParseAsync(projectId);

	return result.success ?
		await fetchProject(projectId) :
		null;
}
