import Link from 'next/link';
import { getServerSession } from '@server/auth-options';
import { fetchUserProfileByUsername } from '@server/queries';
import UserProfileForm from './user-profile.form';
import { Paths } from '@common/constants';
import LogoutButton from '@components/logout-button';
import { redirect } from 'next/navigation';
import { DbUserProfile, WriteUserProfile } from '@common/types/UserProfile';
import { pick } from '@common/utils';
import ProfilePhotoUploader from './profile-photo-uploader';
import {
	Box,
	Button,
	Typography,
} from '@ui';

export default
async function SettingsLayout() {
	const session = await getServerSession();

	if(!session) {
		redirect(Paths.Home);
	}

	const userProfile = await fetchUserProfileByUsername(session.user.username);

	if(!userProfile) {
		return (
			<Typography>
				There was an issue loading your user info.
			</Typography>
		);
	}

	const user = session.user;

	return (
		<>
			<Box padding={2}>
				<ProfilePhotoUploader
					avatarUrl={userProfile.avatar}
					username={user.username}
				/>
			</Box>
			<Typography>
				Signed in as <strong>{user.username}</strong>
			</Typography>
			<Typography>
				Email: <strong>{user.email}</strong>
			</Typography>
			<Box paddingTop={2}>
				<LogoutButton />
			</Box>
			<Box paddingY={2}>
				<Link
					shallow
					passHref
					href={Paths.UserGallery(user.username)}
				>
					<Button>
						My Gallery
					</Button>
				</Link>
			</Box>
			<UserProfileForm userProfile={dbUserProfileToWriteUserProfile(userProfile)} />
		</>
	);
}

function dbUserProfileToWriteUserProfile(userProfile: DbUserProfile): WriteUserProfile {
	return pick(userProfile, 'shortBio', 'detailedBio');
}
