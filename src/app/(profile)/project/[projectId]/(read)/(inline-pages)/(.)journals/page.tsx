import { dbJournalToUiJournal } from '@server/transforms';
import { MongoIdValidation } from '@server/validations';
import { fetchProject, fetchProjectJournals } from '@server/queries';
import { Box } from '@mui/material';
import { Paths } from '@common/constants';
import { JournalIcon } from '@components/icons';
import AnimatedBody from '@app/(profile)/[username]/(read)/(inline-pages)/animated-body';
import ListBottom from '../../list-bottom';

interface Props {
	params: Promise<{
		projectId: string;
	}>;
}

export default
async function InlineJournalsPage(props: Props) {
	const { projectId: rawProjectId } = await props.params;

	const result = await MongoIdValidation.safeParseAsync(rawProjectId);

	// Should be unnecessary since this should be handled in layout.
	if(!result.success) {
		return (
			<>
				Invalid.
			</>
		);
	}

	const { data: projectId } = result;

	const project = await fetchProject(projectId);

	// Should be unnecessary since this should be handled in layout.
	if(!project) {
		return (
			<>
				User not found.
			</>
		);
	}

	const journals = await fetchProjectJournals(projectId);

	return (
		<Box textAlign="center">
			<AnimatedBody
				rootUrl={Paths.Project(projectId)}
				collections={[
					{
						active: true,
						key: 'journals',
						label: 'Project Posts',
						url: Paths.ProjectJournals(projectId),
						icon: JournalIcon,
						items: journals
							.map(dbJournalToUiJournal)
							.map((j) => ({
								...j,
								url: Paths.Journal(j._id),
							})),
					},
				]}
			/>
			<ListBottom project={project} />
		</Box>
	);
}
