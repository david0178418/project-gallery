import { LocalizedDate } from '@components/localized-date';
import MarkdownContent from '@components/markdown-content';
import { fetchProject } from '@server/queries';
import { MongoIdValidation } from '@server/validations';
import { Typography } from '@ui';
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

	if(!result.success) {
		return (
			<Typography>
				No journal posts yet
			</Typography>
		);
	}

	const project = await fetchProject(projectId);

	return (
		<>
			{!!project && (
				<>
					<Typography variant="subtitle1" paddingTop={1} fontStyle="italic">
									created: <LocalizedDate date={project.projectCreatedDate} /><br/>
					</Typography>
					<Typography variant="subtitle1" fontStyle="italic">
									last updated: <LocalizedDate date={project.projectLastUpdatedDate} />
					</Typography>
					<ImageSelector project={dbProjectToUiProject(project)} />
					<Typography paddingTop={2} component="div">
						<MarkdownContent plaintext>
							{project.description}
						</MarkdownContent>
					</Typography>
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
