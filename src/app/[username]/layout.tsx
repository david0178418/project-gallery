import { UsernameValidation } from '@common/types/UserCredentials';
import { fetchUser, fetchUserProfileByUsername } from '@server/queries';
import MarkdownContent from '@components/markdown-content';
import { ReactNode } from 'react';
import CommonStuff from '@app/(content)/common-stuff';
import { EditIcon } from '@components/icons';
import { LogoMain } from '@common/images';
import { urlJoin } from '@common/utils';
import { Metadata } from 'next';
import Link from 'next/link';
import { getServerSession } from '@server/auth-options';
import {
	AppName,
	BaseUrl,
	Paths,
	SpecialCharacterCodes,
} from '@common/constants';
import {
	Avatar,
	Box,
	Button,
	Container,
	Fab,
	Typography,
} from '@ui';

const SocialImageUrl = urlJoin(BaseUrl, LogoMain.src);

interface Props {
	children: ReactNode;
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
				{/** div hack for async component child */}
				<div>
					{children}
				</div>
			</Box>
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

			{!session && (
				<Box textAlign="center" paddingTop={5} paddingX={2} paddingBottom={15}>
					<Link href={Paths.Home}>
						<Button variant="outlined" size="small">
							Explore ProjectGallery.me
						</Button>
					</Link>
				</Box>
			)}
			<CommonStuff/>
		</Container>
	);
}
