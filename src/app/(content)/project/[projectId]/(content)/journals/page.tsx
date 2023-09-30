import { Box, Typography } from '@ui';
import { MongoIdValidation } from '@server/validations';
import JournalCard from '@components/journal-card';
import { getServerSession } from '@server/auth-options';
import { fetchJournals } from '@server/queries';

interface Props {
	params: {
		projectId: string;
	};
}

export default
async function JournalsPage(props: Props) {
	const { params: { projectId } } = props;

	const result = await MongoIdValidation.safeParseAsync(projectId);

	if(!result.success) {
		return (
			<Typography>
				No journal posts yet
			</Typography>
		);
	}

	const session = await getServerSession();
	const journals = (await fetchJournals(session?.user.id));

	return (
		<>
			{journals.map(j => (
				<Box
					padding={1}
					key={j._id.toString()}
				>
					<JournalCard journal={j} />
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
