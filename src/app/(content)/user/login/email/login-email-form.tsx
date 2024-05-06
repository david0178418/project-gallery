'use client';
import { useState } from 'react';
import { Key } from 'ts-key-enum';
import { usePushToastMsg, loadingManager } from '@common/atoms';
import { useRouter } from 'next/navigation';
import { Paths } from '@common/constants';
import Link from 'next/link';
import oneClickSendAction from './one-click-send-action';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';

export default
function LoginEmailForm() {
	const { replace } = useRouter();
	const pushToastMsg = usePushToastMsg();
	const [email, setEmail] = useState('');
	const valid = email.includes('@');

	function handleKeyUp(key: string) {
		if(key === Key.Enter) {
			handleLogin();
		}
	}

	async function handleLogin() {
		loadingManager.show();

		try {
			await oneClickSendAction(email);
			pushToastMsg(`A login link will be sent to "${email}" if an account with this email exists.`);
			replace(Paths.Home);
		} catch(e) {
			pushToastMsg('Something went wrong. Try again.');
			console.log(e);
		}

		loadingManager.hide();
	}

	return (
		<>
			<Box
				noValidate
				autoComplete="off"
				component="form"
			>
				<DialogContent>
					<TextField
						autoFocus
						fullWidth
						variant="standard"
						type="text"
						label="Email"
						value={email}
						onKeyUp={e => handleKeyUp(e.key)}
						onChange={e => setEmail(e.target.value)}
					/>
				</DialogContent>
			</Box>
			<DialogActions>
				<Box paddingRight={2}>
					<Link href={Paths.UserLoginPw} replace>
						<Button color="secondary">
							Sign in with password
						</Button>
					</Link>
				</Box>
				<Button
					variant="outlined"
					disabled={!valid}
					onClick={handleLogin}
				>
					Send email link
				</Button>
			</DialogActions>
		</>
	);
}
