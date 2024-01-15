
import { fetchUser, fetchUserProfileByUsername } from '@server/queries';
import UserGalleryEditForm from './username-edit-form';
import { dbUserProfileToUiUserProfile } from '@server/transforms';
import Link from 'next/link';
import { Paths } from '@common/constants';
import { Fab } from '@mui/material';
import { CheckIcon } from '@components/icons';

interface Props {
	params: {
		username: string;
	};
}

export default async function UserGalleryProfileReadPageLayout(props: Props) {
	const { params: { username: routeUsername } } = props;

	// Validated in about route
	const profileUser = await fetchUser(routeUsername);
	const username = profileUser?.username;

	const userProfile = username && await fetchUserProfileByUsername(username);

	if(!userProfile) {
		return null;
	}

	return (
		<>
			<UserGalleryEditForm userProfile={dbUserProfileToUiUserProfile(userProfile)} />

			<Link href={Paths.UserGallery(username)} >
				<Fab
					color="primary"
					sx={{
						position: 'fixed',
						bottom: 64,
						right: {
							xs: 16,
							md: 32,
						},
					}}
				>
					<CheckIcon />
				</Fab>
			</Link>
		</>
	);
}
