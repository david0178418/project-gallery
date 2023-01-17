import { WriteUserProfile } from '@common/types/UserProfile';
import { TextFieldLengthValidation } from '@components/common/text-field-length-validation';
import { useCallback } from 'react';
import { MaxUserProfileBioLength, MaxUserProfileShortBioLength } from '@common/constants';

interface Props {
	userProfile: WriteUserProfile;
	onChange(newUserProfile: WriteUserProfile): void;
}

export default
function UserProfileForm(props: Props) {
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
