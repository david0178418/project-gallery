import type { GetServerSideProps, NextPage } from 'next';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { getServerSession } from '@server/auth-options';
import { Box, Button } from '@mui/material';
import { PasswordChangeForm } from '@components/password-change-form';
import { UiUserProfile, WriteUserProfile } from '@common/types/UserProfile';
import { TextFieldLengthValidation } from '@components/common/text-field-length-validation';
import { useCallback, useState } from 'react';
import { fetchUserProfileByUsername } from '@server/queries';
import { dbUserProfileToUiUserProfile, uiUserProfileToWriteUserProfile } from '@server/transforms';
import {
	MaxUserProfileBioLength,
	MaxUserProfileShortBioLength,
	ModalActions,
	Paths,
} from '@common/constants';

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
			<UserProfileForm userProfile={userProfile} onChange={setUserProfile} />
			<PasswordChangeForm />
		</Box>
	);
};

export default ProfilePage;

interface UserProfileFormProps {
	userProfile: WriteUserProfile;
	onChange(newUserProfile: WriteUserProfile): void;
}

function UserProfileForm(props: UserProfileFormProps) {
	const {
		onChange,
		userProfile,
	} = props;

	const {
		detailedBio,
		shortBio,
	} = userProfile;

	const handleChange = useCallback((userProfileUpdates: Partial<WriteUserProfile>) => {
		onChange({
			...userProfile,
			...userProfileUpdates,
		});
	}, [userProfile]);

	return (
		<>
			<TextFieldLengthValidation
				fullWidth
				multiline
				autoComplete="off"
				label="Bio summary"
				variant="standard"
				margin="normal"
				type="text"
				minRows={3}
				maxLength={MaxUserProfileShortBioLength}
				value={shortBio}
				onChange={e => handleChange({ shortBio: e.target.value })}
			/>
			<TextFieldLengthValidation
				fullWidth
				multiline
				autoComplete="off"
				label="Full Bio"
				variant="standard"
				margin="normal"
				type="text"
				minRows={6}
				maxLength={MaxUserProfileBioLength}
				value={detailedBio}
				onChange={e => handleChange({ detailedBio: e.target.value })}
			/>
		</>
	);
}
