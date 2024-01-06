import { UsernameValidation } from '@common/types/UserCredentials';
import { fetchUser, fetchUserProfileByUsername } from '@server/queries';
import MarkdownContent from '@components/markdown-content';
import { ReactNode, Suspense } from 'react';
import EditButton from '@components/edit-button.server';
import {
	Paths,
	SpecialCharacterCodes,
} from '@common/constants';
import {
	Avatar,
	Box,
	Container,
	Typography,
} from '@ui';

interface Props {
	children: ReactNode;
	params: {
		username: string;
	};
}

export default async function UserGalleryProfilePageLayout(props: Props) {
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

	const profileUser = result.success ?
		await fetchUser(result.data) :
		null;

	if(!profileUser) {
		return (
			<>
				User not found.
			</>
		);
	}

	const username = profileUser.username;
	const userProfile = await fetchUserProfileByUsername(username);

	return (
		<Container>
			<Box paddingTop={1} paddingBottom={2} >
				<Box
					display="flex"
					flexDirection="column"
					alignItems="center"
					justifyContent="center"
				>
					{userProfile?.avatar && (
						<Avatar
							src={userProfile.avatar}
							sx={{
								width: 100,
								height: 100,
							}}
						/>
					)}
					<Typography variant="h5" component="div">
						{username}{SpecialCharacterCodes.RSQUO}s Gallery
					</Typography>
				</Box>
				{userProfile?.shortBio && (
					<Container maxWidth="sm">
						<MarkdownContent>
							{userProfile.shortBio}
						</MarkdownContent>
					</Container>
				)}
			</Box>
			<Box paddingX={2} paddingY={1}>
				{children}
			</Box>
			{userProfile && (
				<Suspense>
					<EditButton
						userId={userProfile._id.toString()}
						href={Paths.Settings}
					/>
				</Suspense>
			)}
		</Container>
	);
}
