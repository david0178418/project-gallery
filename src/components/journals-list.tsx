import { UiJournal } from '@common/types/Journal';
import JournalCard from '@components/journal-card';
import { Box } from '@mui/material';

interface Props {
	journals: UiJournal[];
}

export default
function JournalsList(props: Props) {
	const { journals } = props;

	return (
		<>
			{journals.map(j => (
				<Box
					padding={1}
					key={j._id}
				>
					<JournalCard
						journal={j}
					/>
				</Box>
			))}
		</>
	);
}
