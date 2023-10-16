import { Box, Typography } from '@ui';
import { MongoIdValidation } from '@server/validations';
import JournalCard from '@components/journal-card';
import {
	fetchProject,
	fetchProjectJournals,
} from '@server/queries';

interface Props {
	params: {
		projectId: string;
	};
}

export default
async function JournalsPage(props: Props) {
	const { params: { projectId } } = props;

	const result = await MongoIdValidation.safeParseAsync(projectId);

	const project = result.success ?
		await fetchProject(projectId) :
		null;

	if(!project) {
		return (
			<Typography>
				Invalid Project
			</Typography>
		);
	}

	const journals = (await fetchProjectJournals(project._id.toString()));

	return (
		<>
			{journals.map(j => (
				<Box
					padding={1}
					key={j._id.toString()}
				>
					{/** Box doesn't like async children, apparently. */}
					<div>
						<JournalCard journal={j} />
					</div>
				</Box>
			))}
			{!journals?.length && (
				<Typography>
					No journal posts yet
				</Typography>
			)}
		</>
	);
}
