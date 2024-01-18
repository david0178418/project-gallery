import { fetchUser, fetchUserProfileByUsername } from '@server/queries';
import { ProfileLinkButton } from '@components/profile-button';
import ProfileShareButton from '@components/profile-share-button';
import { LogoMain } from '@common/images';
import { urlJoin } from '@common/utils';
import { UsernameValidation } from '@common/types/UserCredentials';
import { Metadata } from 'next';
import { JournalIcon, ProjectIcon } from '@components/icons';
import { Fragment, Suspense } from 'react';
import EditButton from '@components/edit-button.server';
import ProfileCustomTextItem from '@components/profile-custom-item-button';
import {
	AppName,
	BaseUrl,
	Paths,
} from '@common/constants';
import { Box } from '@mui/material';
import MarkdownContent from '@components/markdown-content';

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
			<ProfileLinkButton
				icon={ProjectIcon}
				href={Paths.UserGalleryProjects(userProfile.username)}
			>
				Projects
			</ProfileLinkButton>
			<ProfileLinkButton
				icon={JournalIcon}
				href={Paths.UserGalleryJournals(userProfile.username)}
			>
				Posts
			</ProfileLinkButton>
			{userProfile.customItems.map((l, i) => (
				<Fragment key={i}>
					{l.type === 'link' && (
						<ProfileLinkButton
							href={l.value}
							target="_blank"
						>
							{l.label}
						</ProfileLinkButton>
					)}
					{l.type === 'text' && (
						<ProfileCustomTextItem label={l.label}>
							<Box
								display="inline-block"
								maxWidth={600}
								width="100%"
								textAlign="left"
								marginBottom={2}
							>
								<MarkdownContent>
									{l.value}
								</MarkdownContent>
							</Box>
						</ProfileCustomTextItem>
					)}
				</Fragment>
			))}
			<ProfileShareButton shareObj={{
				url: Paths.UserGallery(userProfile.username),
				label: `${userProfile.username}'s Project Gallery`,
				shareMsg: `Check out ${userProfile.username}'s Project Gallery`,
			}}/>

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
