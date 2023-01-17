import type { GetServerSideProps, NextPage } from 'next';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { getServerSession } from '@server/auth-options';
import { Box, Button } from '@mui/material';
import { PasswordChangeForm } from '@components/password-change-form';
import { UiUserProfile } from '@common/types/UserProfile';
import { useState } from 'react';
import { fetchUserProfileByUsername } from '@server/queries';
import { dbUserProfileToUiUserProfile, uiUserProfileToWriteUserProfile } from '@server/transforms';
import {
	ModalActions,
	Paths,
} from '@common/constants';
import UserProfileForm from '@components/forms/user-profile.form';

interface Props {
	userProfile: UiUserProfile | null;
}

export
const getServerSideProps: GetServerSideProps = async (ctx) => {
	const session = await getServerSession(ctx.req, ctx.res);

	if(!session) {
		return {
			redirect: {
				permanent: false,
				destination: Paths.Home,
			},
		};
	}

	const dbUserProfile = await fetchUserProfileByUsername(session.user.username);

	return {
		props: {
			session,
			userProfile: dbUserProfile && dbUserProfileToUiUserProfile(dbUserProfile),
		},
	};
};

const ProfilePage: NextPage<Props> = (props) => {
	const router = useRouter();
	const session = useSession();
	const [userProfile, setUserProfile] = useState(() => props.userProfile && uiUserProfileToWriteUserProfile(props.userProfile));
	const {
		pathname,
		query,
	} = router;

	if(!(session.data?.user && userProfile)) {
		return null;
	}

	const user = session.data.user;

	return (
		<Box padding={2}>
			Signed in as {session.data?.user.username}
			<Link
				shallow
				passHref
				href={{
					pathname,
					query: {
						a: ModalActions.Logout,
						...query,
					},
				}}
			>
				<Button>
					Logout
				</Button>
			</Link>
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
			<Box
				paddingTop={2}
				borderBottom={1}
				borderColor="divider"
			>
				<UserProfileForm userProfile={userProfile} onChange={setUserProfile} />
				<Button>
					Update Profile
				</Button>
			</Box>
			<Box paddingTop={2}>
				<PasswordChangeForm />
			</Box>
		</Box>
	);
};

export default ProfilePage;
