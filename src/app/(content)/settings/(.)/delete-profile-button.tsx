'use client';

import ConfirmActionButton from '@components/common/confirm-action-button';
import updateProfile from './update-profile-action';
import { usePushToastMsg } from '@common/atoms';

export default
function DeleteProfileButton() {
	const pustToastMsg = usePushToastMsg();

	async function handleDelete() {
		try {
			await updateProfile({ avatar: '' });
			pustToastMsg('Profile deleted.');
		} catch(e) {
			pustToastMsg('Something went wrong. Try again.');
			console.log(e);
		}
	}

	return (
		<ConfirmActionButton
			label="Delete Profile"
			confirmationMsg="Are you sure you want to delete your profile image?"
			onConfirm={handleDelete}
		/>
	);
}
