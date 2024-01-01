import { Typography } from '@ui';
import { fetchUserJournals } from '@server/queries';
import { ProfileLinkButton } from '@components/profile-button';
import { Paths } from '@common/constants';
import ProfileShareButton from '@components/profile-share-button';

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
				<Typography paddingBottom={3}>
					No journal posts yet
				</Typography>
			)}
			<ProfileLinkButton href={Paths.UserGallery(username)}>
				Gallery Home
			</ProfileLinkButton>
			{journals.map(j => (
				<ProfileLinkButton
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
