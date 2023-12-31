import JournalCard from '@components/journal-card';
import { Box, Typography } from '@ui';
import { fetchUserJournals } from '@server/queries';

interface Props {
	username: string;
}

export default
async function UserJournalsPage(props: Props) {
	const { username } = props;
	const journals = await fetchUserJournals(username);

	return (
		<>
			{!journals.length && (
				<Typography>
					No journal posts yet
				</Typography>
			)}
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
		</>
	);
}
