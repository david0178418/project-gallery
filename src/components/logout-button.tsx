'use client';
import { useState } from 'react';
import { logout } from '@client/api-calls';
import { usePushToastMsg } from '@common/atoms';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@ui';

export default
function LogoutButton() {
	const [isOpen, setIsOpen] = useState(false);
	const pustToastMsg = usePushToastMsg();

	async function handleLogout() {
		try {
			await logout();
		} catch(e) {
			pustToastMsg('Something went wrong. Try again.');
			console.log(e);
		}

		setIsOpen(false);
	}

	return (
		<>
			<Button variant="outlined" onClick={() => setIsOpen(true)}>
				Logout
			</Button>
			<Dialog open={isOpen}>
				<DialogTitle>
					Logout
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to log out?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button color="error" onClick={() => setIsOpen(false)}>
						Cancel
					</Button>
					<Button onClick={handleLogout}>
						Logout
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
