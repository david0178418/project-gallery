'use client';
import { logout } from '@client/api-calls';
import { usePushToastMsg } from '@common/atoms';
import ConfirmActionButton from './common/confirm-action-button';

export default
function LogoutButton() {
	const pustToastMsg = usePushToastMsg();

	async function handleLogout() {
		try {
			await logout();
		} catch(e) {
			pustToastMsg('Something went wrong. Try again.');
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
