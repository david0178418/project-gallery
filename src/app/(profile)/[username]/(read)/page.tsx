import { ProfileLinkButton } from '@components/profile-button';
import { LogoMain } from '@common/images';
import { urlJoin } from '@common/utils';
import { UsernameValidation } from '@common/types/UserCredentials';
import { Metadata } from 'next';
import { JournalIcon, ProjectIcon } from '@components/icons';
import { Suspense } from 'react';
import EditButton from '@components/edit-button.server';
import {
	AppName,
	BaseUrl,
	Paths,
} from '@common/constants';
import {
	fetchUser,
	fetchUserHasPostsByUsername,
	fetchUserHasProjectsByUsername,
	fetchUserProfileByUsername,
} from '@server/queries';

const SocialImageUrl = urlJoin(BaseUrl, LogoMain.src);
interface Props {
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
	const userHasProjects = await fetchUserHasProjectsByUsername(username);
	const userHasPosts = await fetchUserHasPostsByUsername(username);

	// Should be unnecessary since this should be handled in layout.
	if(!userProfile) {
		return (
			<>
				User not found.
			</>
		);
	}

	return (
		<>
			{userHasProjects && (
				<ProfileLinkButton
					icon={ProjectIcon}
					href={Paths.UserGalleryProjects(userProfile.username)}
				>
					Projects
				</ProfileLinkButton>
			)}
			{userHasPosts && (
				<ProfileLinkButton
					icon={JournalIcon}
					href={Paths.UserGalleryJournals(userProfile.username)}
				>
					Posts
				</ProfileLinkButton>
			)}
			{userProfile && (
				<Suspense>
					<EditButton
						userId={userProfile._id.toString()}
						href={Paths.UserGalleryEdit(username)}
					/>
				</Suspense>
			)}
		</>
	);
}
