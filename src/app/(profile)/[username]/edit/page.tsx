
import UserGalleryEditForm from './username-edit-form';
import { dbProjectToUiProject, dbUserProfileToUiUserProfile } from '@server/transforms';
import Link from 'next/link';
import { Paths } from '@common/constants';
import { Fab } from '@mui/material';
import { CheckIcon } from '@components/icons';
import { isTruthy } from '@common/utils';
import {
	fetchProjectsByUser,
	fetchUser,
	fetchUserGalleryOrder,
	fetchUserProfileByUsername,
} from '@server/queries';

export const experimental_ppr = false;

interface Props {
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
		return null;
	}

	const rawProjects = await fetchProjectsByUser(profileUser._id.toString());
	// TODO Rethink order. Does it need to be independent of the profile?
	const order = await fetchUserGalleryOrder(profileUser._id.toString());

	if(!order) {
		return null;
	}

	const projects = order.projectIdOrder
		.map(o => rawProjects.find(p => p._id.equals(o)))
		.filter(isTruthy);

	return (
		<>
			<UserGalleryEditForm
				userProfile={dbUserProfileToUiUserProfile(userProfile)}
				projects={projects.map(dbProjectToUiProject)}
			/>

			<Link href={Paths.UserGallery(username)}>
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
