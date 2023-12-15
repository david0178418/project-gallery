'use client';
import { logout } from '@client/api-calls';
import { usePushToastMsg } from '@common/atoms';
import ConfirmActionButton from './common/confirm-action-button';
import { ComponentProps } from 'react';

type Props = Pick<ComponentProps<typeof ConfirmActionButton>, 'size'>;

export default
function LogoutButton(props: Props) {
	const { size } = props;
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
			size={size}
			variant="destructive-outline"
			confirmationMsg="Are you sure you want to log out?"
			onConfirm={handleLogout}
		/>
	);
}
