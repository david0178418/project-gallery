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
import { Avatar, AvatarImage } from '@components/ui/avatar';
import Fab from '@components/common/fab';
import {
	AppName,
	BaseUrl,
	Paths,
	SpecialCharacterCodes,
} from '@common/constants';

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
		<div className="container h-screen overflow-hidden relative px-0 sm:px-1 lg:px-2">
			<ScrollContent
				header={
					<div className="pt-1 pb-2">
						<div className="text-right">
							<Link href={Paths.Home} >
								<div className="text-right flex items-center text-blue-500 justify-end">
									<BackIcon fontSize="inherit"/>
									<div>
										ProjectGallery.me
									</div>
								</div>
							</Link>
						</div>
						<div className="flex flex-col items-center justify-center">
							{userProfile?.avatar && (
								<Avatar
									className="w-96 h-96"
								>
									<AvatarImage src={userProfile.avatar} />
								</Avatar>
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
						<UserProfileTabs username={username} />
					</div>
				}
			>
				{children}
			</ScrollContent>
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
			<CommonStuff/>
		</div>
	);
}
