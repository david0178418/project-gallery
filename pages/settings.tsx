import type { GetServerSideProps, NextPage } from 'next';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { getServerSession } from '@server/auth-options';
import { PasswordChangeForm } from '@components/password-change-form';
import { UiUserProfile, WriteUserProfile } from '@common/types/UserProfile';
import { useCallback, useState } from 'react';
import { fetchUserProfileByUsername } from '@server/queries';
import { dbUserProfileToUiUserProfile, uiUserProfileToWriteUserProfile } from '@server/transforms';
import UserProfileForm from '@components/forms/user-profile.form';
import { ScrollContent } from '@components/scroll-content';
import { ConfirmButton } from '@components/common/buttons';
import { updateUserProfile } from '@client/api-calls';
import { loadingAtom, pushToastMsgAtom } from '@common/atoms';
import { useSetAtom } from 'jotai';
import {
	MaxUserProfileBioLength,
	MaxUserProfileShortBioLength,
	ModalActions,
	Paths,
} from '@common/constants';
import {
	Box,
	Button,
	Container,
	Tab,
	Tabs,
	Typography,
} from '@mui/material';

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
	const [selectedTab, setSelectedTab] = useState(0);
	const setLoading = useSetAtom(loadingAtom);
	const pushToastMsg = useSetAtom(pushToastMsgAtom);
	const handleUpdateProfile = useCallback(async () => {
		if(!userProfile) {
			return;
		}

		setLoading(true);

		try {
			await updateUserProfile(userProfile);
			pushToastMsg('Profile updated!');
		} catch {
			pushToastMsg('Something whent wrong');
		}

		setLoading(false);
	}, [userProfile]);
	const {
		pathname,
		query,
	} = router;

	if(!(session.data?.user && userProfile)) {
		return null;
	}

	const user = session.data.user;

	return (
		<ScrollContent
			header={
				<Box
					borderBottom={1}
					borderColor="divider"
				>
					<Tabs value={selectedTab} onChange={(e, newTab) => setSelectedTab(newTab)}>
						<Tab label="Profile" />
						<Tab label="Update Password" />
					</Tabs>
				</Box>
			}
		>
			<Container sx={{ paddingTop: 2 }}>
				{selectedTab === 0 && (
					<>
						<Typography>
							Signed in as <strong>{session.data?.user.username}</strong>
						</Typography>
						<Typography>
							Email: <strong>{session.data?.user.email}</strong>
						</Typography>
						<Box paddingTop={2}>
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
						<Box></Box>
						<UserProfileForm userProfile={userProfile} onChange={setUserProfile} />
						<ConfirmButton
							onClick={handleUpdateProfile}
							disabled={!isValidProfile(userProfile)}
						>
							Update Profile
						</ConfirmButton>
					</>
				)}
				{selectedTab === 1 && (
					<>
						<Box paddingTop={2}>
							<PasswordChangeForm />
						</Box>
					</>
				)}
			</Container>
		</ScrollContent>
	);
};

export default ProfilePage;

function isValidProfile(userProfile: WriteUserProfile) {
	return (
		userProfile.detailedBio.length <= MaxUserProfileBioLength &&
		userProfile.shortBio.length <= MaxUserProfileShortBioLength
	);
}
