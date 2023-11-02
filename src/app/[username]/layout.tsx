import { UsernameValidation } from '@common/types/UserCredentials';
import { fetchUser, fetchUserProfileByUsername } from '@server/queries';
import MarkdownContent from '@components/markdown-content';
import UserProfileTabs from './user-profile-tabs';
import { ReactNode } from 'react';
import CommonStuff from '@app/(content)/common-stuff';
import { BackIcon, EditIcon } from '@components/icons';
import { LogoMain } from '@common/images';
import { urlJoin } from '@common/utils';
import { Metadata } from 'next';
import Link from 'next/link';
import { getServerSession } from '@server/auth-options';
import { ScrollContent } from '@components/scroll-content';
import {
	AppName,
	BaseUrl,
	Paths,
	SpecialCharacterCodes,
} from '@common/constants';
import {
	Avatar,
	Box,
	Container,
	Fab,
	Typography,
} from '@ui';

const SocialImageUrl = urlJoin(BaseUrl, LogoMain.src);

interface Props {
	params: {
		username: string;
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

	const title = `${userProfile.username}'s Gallery`;
	const description = userProfile.shortBio;
	const url = urlJoin(BaseUrl, Paths.UserGallery(username));

	return {
		metadataBase: new URL(BaseUrl),
		title,
		description,
		openGraph: {
			type: 'website',
			locale: 'en_IE',
			url,
			siteName: AppName,
			title,
			description,
			images: [{ url: SocialImageUrl }],
		},
	};
}

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

	const session = await getServerSession();
	const isOwner = session?.user.id === profileUser._id.toString();

	return (
		<Container
			sx={{
				height: '100vh',
				overflow: 'hidden',
				position: 'relative',
				paddingX: {
					xs: 0,
					sm: 1,
					lg: 2,
				},
			}}
		>
			<ScrollContent
				header={
					<Box sx={{
						paddingTop: 1,
						paddingBottom: 2,
					}}>
						<Box textAlign="right">
							<Link href={Paths.Home} >
								<Box
									textAlign="right"
									display="flex"
									alignItems="center"
									color="primary.main"
									justifyContent="end"
								>
									<BackIcon fontSize="inherit"/>
									<Typography color="inherit">
										ProjectGallery.me
									</Typography>
								</Box>
							</Link>
						</Box>
						<Box sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
						}}>
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
						<UserProfileTabs username={username} />
					</Box>
				}
			>
				{children}
			</ScrollContent>
			{isOwner && (
				<Link href={Paths.Settings} >
					<Fab
						color="primary"
						sx={{
							position: 'absolute',
							bottom: 64,
							right: {
								xs: 16,
								md: 32,
							},
						}}
					>
						<EditIcon />
					</Fab>
				</Link>
			)}
			<CommonStuff/>
		</Container>
	);
}
