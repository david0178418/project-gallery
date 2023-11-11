import { LocalizedDate } from '@components/localized-date';
import MarkdownContent from '@components/markdown-content';
import { fetchProject } from '@server/queries';
import { MongoIdValidation } from '@server/validations';
import ImageSelector from './image-selector';
import { dbProjectToUiProject } from '@server/transforms';

interface Props {
	params: {
		projectId: string;
	};
}

export default
async function DetailsPage(props: Props) {
	const { params: { projectId } } = props;

	const result = await MongoIdValidation.safeParseAsync(projectId);

	const project = result.success ?
		await fetchProject(projectId) :
		null;

	if(!project) {
		return (
			<div>
				Invalid Project
			</div>
		);
	}

	return (
		<>
			{!!project && (
				<>
					<div className="pt-1 italic">
									created: <LocalizedDate date={project.projectCreatedDate} /><br/>
					</div>
					<div className="italic">
									last updated: <LocalizedDate date={project.projectLastUpdatedDate} />
					</div>
					<ImageSelector project={dbProjectToUiProject(project)} />
					<div className="pt-2">
						<MarkdownContent plaintext>
							{project.description}
						</MarkdownContent>
					</div>
				</>
			)}
			{!project && (
				<>
					Invalid Project Id
				</>
			)}
		</>
	);
}
