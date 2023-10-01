'use client';
import { WriteUserProfile } from '@common/types/UserProfile';
import { TextFieldLengthValidation } from '@components/common/text-field-length-validation';
import { useCallback, useState } from 'react';
import { MaxUserProfileBioLength, MaxUserProfileShortBioLength } from '@common/constants';
import { ConfirmButton } from '@components/common/buttons';
import { usePushToastMsg, useSetLoading } from '@common/atoms';
import updateProfile from './update-profile-action';

interface Props {
	userProfile: WriteUserProfile;
}

export default
function UserProfileForm(props: Props) {
	const { userProfile: rawUserProfile } = props;
	const setLoading = useSetLoading();
	const pushToastMsg = usePushToastMsg();
	const [userProfile, setUserProfile] = useState(rawUserProfile);

	const {
		detailedBio,
		shortBio,
	} = userProfile;

	const handleChange = useCallback((userProfileUpdates: Partial<WriteUserProfile>) => {
		setUserProfile({
			...userProfile,
			...userProfileUpdates,
		});
	}, [userProfile]);

	const handleUpdateProfile = useCallback(async () => {
		if(!userProfile) {
			return;
		}

		setLoading(true);

		try {
			const response = await updateProfile(userProfile);
			pushToastMsg('Profile updated!');

			console.log(response);

			if(!response.ok) {
				response.errors?.map(pushToastMsg);
			}
		} catch {
			console.log(2222, userProfile);
			pushToastMsg('Something whent wrong');
		}

		setLoading(false);
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
			<ConfirmButton
				onClick={handleUpdateProfile}
				disabled={!isValidProfile(userProfile)}
			>
				Update Profile
			</ConfirmButton>
		</>
	);
}

function isValidProfile(userProfile: WriteUserProfile) {
	return (
		userProfile.detailedBio.length <= MaxUserProfileBioLength &&
		userProfile.shortBio.length <= MaxUserProfileShortBioLength
	);
}
