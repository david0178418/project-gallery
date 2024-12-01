import { fetchUser, fetchUserProfileByUsername } from '@server/queries';
import MarkdownContent from '@components/markdown-content';
import { type ReactNode } from 'react';
import { Paths } from '@common/constants';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import MoreLessToggle from '@components/more-less-toggle';
import Link from 'next/link';
import { Button } from '@mui/material';

interface Props {
	children: ReactNode;
	params: Promise<{
		username: string;
	}>;
}

export default async function UserGalleryProfileReadPageLayout(props: Props) {
	const { username: routeUsername } = await props.params;

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
						{userProfile.title}
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
						<MoreLessToggle>
							<MarkdownContent>
								{userProfile.detailedBio}
							</MarkdownContent>
						</MoreLessToggle>
					</Container>
				)}
			</Box>
			<Box textAlign="center">
				{props.children}
				<Box paddingTop={5} paddingX={2} paddingBottom={15}>
					<Link href={Paths.UserRegister}>
						<Button variant="outlined" size="small">
							Create your own project gallery / Login
						</Button>
					</Link>
				</Box>
			</Box>
		</>
	);
}
