import { fetchUser, fetchUserProfileByUsername } from '@server/queries';
import { Suspense, type ReactNode } from 'react';
import { Paths } from '@common/constants';
import EditButton from '@components/edit-button.server';

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
			{children}
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
