import Typography from '@mui/material/Typography';
import { fetchUserJournals } from '@server/queries';
import { ProfileLinkButton } from '@components/profile-button';
import { Paths } from '@common/constants';
import ProfileShareButton from '@components/profile-share-button';
import { JournalIcon } from '@components/icons';

interface Props {
	params: Promise<{
		username: string;
		profilePage: string;
	}>;
}

export default
async function UserJournalsPage(props: Props) {
	const { username } = await props.params;
	const journals = await fetchUserJournals(username);

	return (
		<>
			{!journals.length && (
				<Typography paddingBottom={3}>
					No journal posts yet
				</Typography>
			)}
			{journals.map(j => (
				<ProfileLinkButton
					icon={JournalIcon}
					key={j._id.toString()}
					href={Paths.Journal(j._id.toString())}
				>
					{j.title}
				</ProfileLinkButton>
			))}
			<ProfileShareButton shareObj={{
				url: Paths.UserGallery(username),
				label: `${username}'s Project Posts`,
				shareMsg: `Check out ${username}'s Project Posts`,
			}}/>
		</>
	);
}
