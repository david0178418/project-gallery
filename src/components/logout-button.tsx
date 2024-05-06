'use client';
import { logout } from '@client/api-calls';
import { toastManager } from '@common/atoms';
import ConfirmActionButton from './common/confirm-action-button';

export default
function LogoutButton() {
	async function handleLogout() {
		try {
			await logout();
		} catch(e) {
			toastManager.pushMessage('Something went wrong. Try again.');
			console.log(e);
		}
	}

	return (
		<ConfirmActionButton
			label="Logout"
			confirmationMsg="Are you sure you want to log out?"
			onConfirm={handleLogout}
		/>
	);
}
