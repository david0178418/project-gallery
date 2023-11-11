import LinksList from '@components/links-list';
import { fetchProject } from '@server/queries';
import { MongoIdValidation } from '@server/validations';

interface Props {
	params: {
		projectId: string;
	};
}

export default
async function LinksPage(props: Props) {
	const { params: { projectId } } = props;

	const result = await MongoIdValidation.safeParseAsync(projectId);

	if(!result.success) {
		return (
			<div>
				No journal posts yet
			</div>
		);
	}

	const project = await fetchProject(projectId);

	return (
		<>
			{!!project?.links.length && (
				<LinksList links={project.links} />
			)}
			{!project?.links.length && (
				<div>
					No links yet
				</div>
			)}
		</>
	);
}
