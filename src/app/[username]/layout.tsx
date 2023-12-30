import { UsernameValidation } from '@common/types/UserCredentials';
import { fetchUser, fetchUserProfileByUsername } from '@server/queries';
import MarkdownContent from '@components/markdown-content';
import UserProfileTabs from './user-profile-tabs';
import { ReactNode } from 'react';
import { EditIcon } from '@components/icons';
import { LogoMainImage } from '@common/images';
import { urlJoin } from '@common/utils';
import { Metadata } from 'next';
import Link from 'next/link';
import { getServerSession } from '@server/auth-options';
import Fab from '@components/common/fab';
import Avatar from '@components/common/avatar';
import {
	AppName,
	BaseUrl,
	Paths,
	SpecialCharacterCodes,
} from '@common/constants';

const SocialImageUrl = urlJoin(BaseUrl, LogoMainImage.src);

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
		<div className="container relative px-0 sm:px-1 lg:px-2">
			<div className="pt-1 pb-2">
				<div className="flex flex-col items-center justify-center">
					{userProfile?.avatar && (
						<Avatar
							className="w-64 h-64"
							src={userProfile.avatar}
						/>
					)}
					<div className="font-bold">
						{username}{SpecialCharacterCodes.RSQUO}s Gallery
					</div>
				</div>
				{userProfile?.shortBio && (
					<div className="container max-w-screen-sm" >
						<MarkdownContent>
							{userProfile.shortBio}
						</MarkdownContent>
					</div>
				)}
				<div className="text-center">
					<UserProfileTabs username={username} />
				</div>
			</div>
			{children}
			{isOwner && (
				<Link href={Paths.Settings} >
					<Fab
						// sx={{
						// 	position: 'absolute',
						// 	bottom: 64,
						// 	right: {
						// 		xs: 16,
						// 		md: 32,
						// 	},
						// }}
					>
						<EditIcon />
					</Fab>
				</Link>
			)}
		</div>
	);
}
