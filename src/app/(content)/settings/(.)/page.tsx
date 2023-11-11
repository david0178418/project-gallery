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
import DeleteProfileButton from './delete-profile-button';
import { Button } from '@components/ui/button';

export default
async function SettingsLayout() {
	const session = await getServerSession();

	if(!session) {
		redirect(Paths.Home);
	}

	const userProfile = await fetchUserProfileByUsername(session.user.username);

	if(!userProfile) {
		return (
			<div>
				There was an issue loading your user info.
			</div>
		);
	}

	const user = session.user;

	return (
		<>
			<div className="p-2">
				<ProfilePhotoUploader
					avatarUrl={userProfile.avatar}
					username={user.username}
				/>
				{userProfile.avatar && (
					<div className="pt-2">
						<DeleteProfileButton />
					</div>
				)}
			</div>
			<div>
				Signed in as <strong>{user.username}</strong>
			</div>
			<div>
				Email: <strong>{user.email}</strong>
			</div>
			<div className="pt-2">
				<LogoutButton />
			</div>
			<div className="py-2">
				<Link
					shallow
					passHref
					href={Paths.UserGallery(user.username)}
				>
					<Button>
						My Gallery
					</Button>
				</Link>
			</div>
			<UserProfileForm userProfile={dbUserProfileToWriteUserProfile(userProfile)} />
		</>
	);
}

function dbUserProfileToWriteUserProfile(userProfile: DbUserProfile): WriteUserProfile {
	return pick(userProfile, 'shortBio', 'detailedBio');
}
