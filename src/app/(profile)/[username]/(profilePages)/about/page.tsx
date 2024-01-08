import { UsernameValidation } from '@common/types/UserCredentials';
import MarkdownContent from '@components/markdown-content';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { fetchUser, fetchUserProfileByUsername } from '@server/queries';
import { urlJoin } from '@common/utils';
import { LogoMain } from '@common/images';
import {
	AppName,
	BaseUrl,
	Paths,
} from '@common/constants';
import { Metadata } from 'next';

const SocialImageUrl = urlJoin(BaseUrl, LogoMain.src);

interface Props {
	params: {
		username: string;
		profilePage: string;
	};
}

export default
async function UserAboutPage(props: Props) {
	const { params: { username } } = props;
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
			<Box paddingTop={4}>
				<MarkdownContent>
					{userProfile.detailedBio}
				</MarkdownContent>
			</Box>
		</>
	);
}

export async function generateMetadata(props: Props): Promise<Metadata> {
	const { params: { username: routeUsername } } = props;

	const result = await UsernameValidation.safeParseAsync(routeUsername);

	if(!result.success) {
		return {};
	}

	const user = result.success ?
		await fetchUser(result.data) :
		null;

	if(!user) {
		return {};
	}

	const username = user.username;
	const userProfile = await fetchUserProfileByUsername(username);

	if(!userProfile) {
		return {};
	}

	const title = `${username}'s Gallery - About`;
	const description = userProfile.shortBio;
	const url = urlJoin(BaseUrl, Paths.UserGallery(username));

	return {
		metadataBase: new URL(BaseUrl),
		title,
		description,
		openGraph: {
			type: 'website',
			locale: 'en_US',
			url,
			siteName: AppName,
			title,
			description,
			images: [{ url: SocialImageUrl }],
		},
	};
}
