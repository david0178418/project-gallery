import { ProfileLinkButton } from '@components/profile-button';
import { Fragment, Suspense } from 'react';
import { Paths } from '@common/constants';
import ProfileCustomTextItem from '@components/profile-custom-item-button';
import { Box } from '@mui/material';
import MarkdownContent from '@components/markdown-content';
import ProfileShareButton from '@components/profile-share-button';
import { DbUserProfile } from '@common/types/UserProfile';
import EditButton from '@components/edit-button.server';

interface Props {
	userProfile: DbUserProfile;
}

export default
function ListBottom(props: Props) {
	const { userProfile } = props;

	return (
		<>
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
			<Suspense>
				<EditButton
					userId={userProfile._id.toString()}
					href={Paths.UserGalleryEdit(userProfile.username)}
				/>
			</Suspense>
		</>
	);
}
