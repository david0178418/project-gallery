import { UsernameValidation } from '@common/types/UserCredentials';
import { ScrollContent } from '@components/scroll-content';
import { fetchUser, fetchUserProfileByUsername } from '@server/queries';
import { SpecialCharacterCodes } from '@common/constants';
import BackButton from '@components/back-button';
import MarkdownContent from '@components/markdown-content';
import UserProfileTabs from './user-profile-tabs';
import { ReactNode } from 'react';
import {
	Box,
	Typography,
} from '@ui';

interface Props {
	children: ReactNode;
	params: {
		username: string;
	}
}

export default async function UserGalleryLayout(props: Props) {
	const {
		children,
		params: { username: routeUsername },
	} = props;

	const result = await UsernameValidation.safeParseAsync(routeUsername);

	if(!result.success) {
		return (
			<>
				User not found.
			</>
		);
	}

	const user = result.success ?
		await fetchUser(result.data) :
		null;

	if(!user) {
		return (
			<>
				User not found.
			</>
		);
	}

	const username = user.username;
	const userProfile = await fetchUserProfileByUsername(username);

	return (
		<ScrollContent
			header={
				<Box sx={{
					paddingTop: 1,
					paddingBottom: 2,
				}}>
					<Typography variant="h5" component="div" gutterBottom>
						<BackButton />{SpecialCharacterCodes.NBSP}
						{username}{SpecialCharacterCodes.RSQUO}s Gallery
					</Typography>
					{userProfile?.shortBio && (
						<Box paddingX={2}>
							<MarkdownContent>
								{userProfile.shortBio}
							</MarkdownContent>
						</Box>
					)}
					<Box sx={{
						paddingY: 2,
						borderBottom: 1,
						borderColor: 'divider',
					}}>
						<UserProfileTabs username={username} />
					</Box>
				</Box>
			}
		>
			{children}
		</ScrollContent>
	);
}
