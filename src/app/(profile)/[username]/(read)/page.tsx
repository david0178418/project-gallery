import { ProfileLinkButton } from '@components/profile-button';
import { LogoMain } from '@common/images';
import { urlJoin } from '@common/utils';
import { UsernameValidation } from '@common/types/UserCredentials';
import { Metadata } from 'next';
import ListBottom from './list-bottom';
import {
	fetchUser,
	fetchUserHasPostsByUsername,
	fetchUserHasProjectsByUsername,
	fetchUserProfileByUsername,
} from '@server/queries';
import {
	ExpandMoreIcon,
	JournalIcon,
	ProjectIcon,
} from '@components/icons';
import {
	AppName,
	BaseUrl,
	Paths,
} from '@common/constants';

const SocialImageUrl = urlJoin(BaseUrl, LogoMain.src);
interface Props {
	params: Promise<{
		username: string;
		profilePage: string;
	}>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
	const { username: routeUsername } = await props.params;

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
	const { username } = await props.params;

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
					prefetch
					icon={ProjectIcon}
					endIcon={
						<ExpandMoreIcon sx={{
							position: 'absolute',
							right: 30,
							top: '50%',
							transform: 'translateY(-50%)',
						}}/>
					}
					href={Paths.UserGalleryProjects(userProfile.username)}
				>
					Projects
				</ProfileLinkButton>
			)}
			{userHasPosts && (
				<ProfileLinkButton
					prefetch
					icon={JournalIcon}
					endIcon={
						<ExpandMoreIcon sx={{
							position: 'absolute',
							right: 30,
							top: '50%',
							transform: 'translateY(-50%)',
						}}/>
					}
					href={Paths.UserGalleryJournals(userProfile.username)}
				>
					Posts
				</ProfileLinkButton>
			)}
			<ListBottom userProfile={userProfile} />
		</>
	);
}
