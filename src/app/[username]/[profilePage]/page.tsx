import { UsernameValidation } from '@common/types/UserCredentials';
import { fetchUser, fetchUserProfileByUsername } from '@server/queries';
import { ReactNode } from 'react';
import { LogoMain } from '@common/images';
import { urlJoin } from '@common/utils';
import { Metadata } from 'next';
import { ProfilePages } from './profile-pages';
import {
	AppName,
	BaseUrl,
	Paths,
} from '@common/constants';

const SocialImageUrl = urlJoin(BaseUrl, LogoMain.src);

interface Props {
	children: ReactNode;
	params: {
		username: string;
		profilePage: string;
	};
}

export async function generateMetadata(props: Props): Promise<Metadata> {
	const {
		params: {
			profilePage,
			username: routeUsername,
		},
	} = props;

	const page = ProfilePages[profilePage as keyof typeof ProfilePages];

	if(!page) {
		return {};
	}

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

	const title = `${username}'s Gallery - ${page.label}`;
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

export default async function UserGalleryProfilePage(props: Props) {
	const {
		params: {
			profilePage,
			username,
		},
	} = props;

	const page = ProfilePages[profilePage as keyof typeof ProfilePages];

	if(!page) {
		return null;
	}

	return <page.Component username={username} />;
}
