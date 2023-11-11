import JournalCard from '@components/journal-card';
import { fetchUserJournals } from '@server/queries';

interface Props {
	params: {
		username: string;
	};
}

export default
async function UserJournalsPage(props: Props) {
	const { params: { username } } = props;
	const journals = await fetchUserJournals(username);

	return (
		<>
			{!journals.length && (
				<div>
					No journal posts yet
				</div>
			)}
			{journals.map(j => (
				<div
					className="p-1"
					key={j._id.toString()}
				>
					{/** Box doesn't like async children, apparently. */}
					<div>
						<JournalCard journal={j} />
					</div>
				</div>
			))}
		</>
	);
}
