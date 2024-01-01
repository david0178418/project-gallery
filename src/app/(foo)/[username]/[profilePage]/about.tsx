import { Paths } from '@common/constants';
import { UsernameValidation } from '@common/types/UserCredentials';
import MarkdownContent from '@components/markdown-content';
import { ProfileLinkButton } from '@components/profile-button';
import { Box, Typography } from '@ui';
import { fetchUserProfileByUsername } from '@server/queries';

interface Props {
	username: string;
}

export default
async function UserAboutPage(props: Props) {
	const { username } = props;
	const result = await UsernameValidation.safeParseAsync(username);

	const userProfile = result.success ?
		await fetchUserProfileByUsername(username) :
		null;

	if(!userProfile) {
		return (
			<Typography>
				Invalid User
			</Typography>
		);
	}

	return (
		<>
			<MarkdownContent>
				{userProfile.detailedBio}
			</MarkdownContent>
			<Box paddingTop={4}>
				<ProfileLinkButton href={Paths.UserGallery(username)}>
					Gallery Home
				</ProfileLinkButton>
			</Box>
		</>
	);
}
