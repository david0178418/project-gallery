import { fetchUser, fetchUserProfileByUsername } from '@server/queries';
import MarkdownContent from '@components/markdown-content';
import { Suspense, type ReactNode } from 'react';
import { Paths, SpecialCharacterCodes } from '@common/constants';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import EditButton from '@components/edit-button.server';
import CollapseToggle from '@components/collapse-toggle';
import Link from 'next/link';
import { Button } from '@mui/material';

interface Props {
	children: ReactNode;
	params: {
		username: string;
	};
}

export default async function UserGalleryProfileReadPageLayout(props: Props) {
	const {
		children,
		params: { username: routeUsername },
	} = props;

	// Validated in about route
	const profileUser = await fetchUser(routeUsername);
	const username = profileUser?.username;

	const userProfile = username && await fetchUserProfileByUsername(username);

	if(!userProfile) {
		return (
			<>
				Invalid User
			</>
		);
	}

	return (
		<>
			<Box paddingTop={1} paddingBottom={2} >
				<Box
					display="flex"
					flexDirection="column"
					alignItems="center"
					justifyContent="center"
				>
					{userProfile.avatar && (
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
				{userProfile.shortBio && (
					<Container maxWidth="sm">
						<MarkdownContent>
							{userProfile.shortBio}
						</MarkdownContent>
					</Container>
				)}
				{userProfile.detailedBio && (
					<Container maxWidth="sm">
						<CollapseToggle>
							<MarkdownContent>
								{userProfile.detailedBio}
							</MarkdownContent>
						</CollapseToggle>
					</Container>
				)}
			</Box>
			<Box textAlign="center">
				{children}
				<Box paddingTop={5} paddingX={2} paddingBottom={15}>
					<Link href={Paths.Home}>
						<Button variant="outlined" size="small">
							Explore ProjectGallery.me
						</Button>
					</Link>
				</Box>
			</Box>
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
