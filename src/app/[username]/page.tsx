import { Paths } from '@common/constants';
import { fetchUserProfileByUsername } from '@server/queries';
import { Box } from '@ui';
import ProfileButton from './profile-button';
import ProfileShareButton from './profile-share-button';

interface Props {
	params: {
		username: string;
	};
}

export default
async function GalleryPage(props: Props) {
	const { params: { username } } = props;

	const userProfile = await fetchUserProfileByUsername(username);

	// Should be unnecessary since this should be handled in layout.
	if(!userProfile) {
		return (
			<>
				User not found.
			</>
		);
	}

	return (
		<Box textAlign="center">
			<ProfileButton href={Paths.UserGalleryProjects(userProfile.username)}>
				Projects
			</ProfileButton>
			<ProfileButton href={Paths.UserGalleryJournals(userProfile.username)}>
				Posts
			</ProfileButton>
			{!!userProfile.detailedBio && (
				<ProfileButton href={Paths.UserGalleryAbout(userProfile.username)}>
					About
				</ProfileButton>
			)}
			{userProfile.links.map((l, i) => (
				<ProfileButton key={i} href={l.url}>
					{l.label}
				</ProfileButton>
			))}
			<ProfileShareButton username={username} />
		</Box>
	);
}
