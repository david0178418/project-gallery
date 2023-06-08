'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { ModalActions } from '@common/constants';
import { logout } from '@client/api-calls';
import { useAtom } from 'jotai';
import { pushToastMsgAtom } from '@common/atoms';
import {
	useIsLoggedOut,
	useQueryParam,
	useUpdateQueryParam,
} from '@common/hooks';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@ui';

export default
function LogoutModal() {
	const [, pustToastMsg] = useAtom(pushToastMsgAtom);
	const { replace } = useRouter();
	const isLoggedOut = useIsLoggedOut();
	const createUpdatedUrl = useUpdateQueryParam();
	const action = useQueryParam('a');
	const actionIsLogin = action === ModalActions.Logout;
	const isOpen = actionIsLogin && !isLoggedOut;

	useEffect(() => {
		if(!actionIsLogin) {
			return;
		}

		if(isLoggedOut) {
			replace(createUpdatedUrl('a', ''));
		}
	}, [actionIsLogin, isLoggedOut]);

	async function handleLogout() {
		try {
			await logout();
		} catch(e) {
			pustToastMsg('Something went wrong. Try again.');
			console.log(e);
		}
	}

	return (
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
				<Link
					replace
					passHref
					shallow
					href={createUpdatedUrl('a', '')}
				>
					<Button color="error">
						Cancel
					</Button>
				</Link>
				<Button onClick={handleLogout}>
					Logout
				</Button>
			</DialogActions>
		</Dialog>
	);
}
