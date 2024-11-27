import { fetchUser, fetchUserProfileByUsername } from '@server/queries';
import { type ReactNode } from 'react';
import ListBottom from '../list-bottom';

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
			{props.children}
			<ListBottom userProfile={userProfile} />
		</>
	);
}
