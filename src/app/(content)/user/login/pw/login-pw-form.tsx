'use client';
import { useState } from 'react';
import { Key } from 'ts-key-enum';
import { login } from '@client/api-calls';
import { inRange } from '@common/utils';
import Link from 'next/link';
import { usePushToastMsg, loadingManager } from '@common/atoms';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import {
	Paths,
	UsernameMaxLength,
	UsernameMinLength,
} from '@common/constants';

export default
function LoginPwForm() {
	const pushToastMsg = usePushToastMsg();
	const { refresh } = useRouter();
	const [usernameOrEmail, setUsernameOrEmail] = useState('');
	const [password, setPassword] = useState('');
	const validUsernameLength = inRange(usernameOrEmail.length, UsernameMinLength, UsernameMaxLength, true);
	const valid = !!(
		password &&
		usernameOrEmail &&
		validUsernameLength
	);

	function handleKeyUp(key: string) {
		if(key === Key.Enter) {
			handleLogin();
		}
	}

	async function handleLogin() {
		if(!valid) {
			return;
		}

		loadingManager.show();

		try {
			const results = await login(usernameOrEmail, password);

			if(results?.ok) {
				pushToastMsg(`Logged in as ${usernameOrEmail}`);
				refresh();
			} else {
				pushToastMsg('Incorrect Login');
			}

		} catch(e) {
			pushToastMsg('Something went wrong. Try again.');
			console.log(e);
		}

		loadingManager.hide();
		setPassword('');
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
						placeholder="username"
						type="text"
						label="Username or Email"
						value={usernameOrEmail}
						onKeyUp={e => handleKeyUp(e.key)}
						onChange={e => setUsernameOrEmail(e.target.value)}
					/>
					<TextField
						fullWidth
						label="Password"
						variant="standard"
						type="password"
						value={password}
						onKeyUp={e => handleKeyUp(e.key)}
						onChange={e => setPassword(e.target.value)}
					/>
				</DialogContent>
			</Box>
			<DialogActions>
				<Box paddingRight={2}>
					<Link href={Paths.UserLoginEmail} replace>
						<Button color="secondary">
							Sign in with Email Link
						</Button>
					</Link>
				</Box>
				<Button
					variant="outlined"
					disabled={!valid}
					onClick={handleLogin}
				>
					Sign in
				</Button>
			</DialogActions>
		</>
	);
}
