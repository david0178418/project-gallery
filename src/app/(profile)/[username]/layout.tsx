import { UsernameValidation } from '@common/types/UserCredentials';
import { fetchUser, fetchUserProfileByUsername } from '@server/queries';
import { type ReactNode } from 'react';
import Container from '@mui/material/Container';

interface Props {
	children: ReactNode;
	params: Promise<{
		username: string;
	}>;
}

export default async function UserGalleryProfilePageLayout(props: Props) {
	const { username: routeUsername } = await props.params;

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

	if(!userProfile) {
		return (
			<>
				Invalid User
			</>
		);
	}

	return (
		<Container>
			{props.children}
		</Container>
	);
}
