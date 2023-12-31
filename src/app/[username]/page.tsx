import {
	AppName, BaseUrl, Paths,
} from '@common/constants';
import { fetchUser, fetchUserProfileByUsername } from '@server/queries';
import { Box } from '@ui';
import ProfileButton from './profile-button';
import ProfileShareButton from './profile-share-button';
import { ReactNode } from 'react';
import { LogoMain } from '@common/images';
import { urlJoin } from '@common/utils';
import { UsernameValidation } from '@common/types/UserCredentials';
import { Metadata } from 'next';

const SocialImageUrl = urlJoin(BaseUrl, LogoMain.src);
interface Props {
	children: ReactNode;
	params: {
		username: string;
		profilePage: string;
	};
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

	const title = `${username}'s Gallery`;
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
				<ProfileButton key={i} href={l.url} target="_blank">
					{l.label}
				</ProfileButton>
			))}
			<ProfileShareButton username={username} />
		</Box>
	);
}
