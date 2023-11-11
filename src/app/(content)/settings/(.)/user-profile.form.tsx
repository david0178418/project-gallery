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

			if(!response.ok) {
				response.errors?.map(pushToastMsg);
			}
		} catch {
			pushToastMsg('Something whent wrong');
		}

		setLoading(false);
	}, [userProfile]);

	return (
		<>
			<TextFieldLengthValidation
				multiline
				className="w-full"
				autoComplete="off"
				label="Bio summary"
				type="text"
				maxLength={MaxUserProfileShortBioLength}
				value={shortBio}
				onChange={e => handleChange({ shortBio: e.target.value })}
			/>
			<TextFieldLengthValidation
				multiline
				className="w-full"
				autoComplete="off"
				label="Full Bio"
				type="text"
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
