'use client';

import ConfirmActionButton from '@components/common/confirm-action-button';
import updateProfile from './update-profile-action';
import { toastManager } from '@common/atoms';

export default
function DeleteProfileButton() {
	async function handleDelete() {
		try {
			await updateProfile({ avatar: '' });
			toastManager.pushMessage('Profile deleted.');
		} catch(e) {
			toastManager.pushMessage('Something went wrong. Try again.');
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
