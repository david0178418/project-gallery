import { useState } from 'react';
import { Key } from 'ts-key-enum';
import { login, sendLoginLink } from '@client/api-calls';
import { usePushToastMsg, useSetLoading } from '@common/atoms';
import Link from 'next/link';
import { UrlObject } from 'url';
import {
	Box,
	Button,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
} from '@mui/material';
import { useRouter } from 'next/router';

interface Props {
	urlObj: UrlObject;
}

export
function LoginForm(props: Props) {
	const { urlObj } = props;
	const { replace } = useRouter();
	const pushToastMsg = usePushToastMsg();
	const setLoading = useSetLoading();
	const [usernameOrEmail, setUsernameOrEmail] = useState('');
	const [password, setPassword] = useState('');
	const valid = !!(password && usernameOrEmail);
	const isEmail = usernameOrEmail.includes('@');

	function handleKeyUp(key: string) {
		if(key === Key.Enter) {
			handleLogin();
		}
	}

	async function handleLogin() {
		if(!valid) {
			return;
		}

		setLoading(true);

		try {
			const results = await login(usernameOrEmail, password);

			if(results?.ok) {
				pushToastMsg(`Logged in as ${usernameOrEmail}`);
				setUsernameOrEmail('');
			} else {
				pushToastMsg('Incorrect Login');
			}

		} catch(e) {
			pushToastMsg('Something went wrong. Try again.');
			console.log(e);
		}

		setLoading(false);
		setPassword('');
	}

	async function handleEmailLogin() {
		setLoading(true);

		try {
			await sendLoginLink(usernameOrEmail);
			pushToastMsg(`A login link will be sent to "${usernameOrEmail}" if an account with this email exists.`);
			replace(urlObj);
		} catch(e) {
			pushToastMsg('Something went wrong. Try again.');
			console.log(e);
		}

		setLoading(false);
	}

	return (
		<>
			<DialogTitle>
				Login
			</DialogTitle>
			<Box
				noValidate
				autoComplete="off"
				component="form"
			>
				<DialogContent>
					<TextField
						autoFocus
						fullWidth
						label="Username or Email"
						variant="standard"
						placeholder="username"
						type="text"
						value={usernameOrEmail}
						onKeyUp={e => handleKeyUp(e.key)}
						onChange={e => setUsernameOrEmail(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Box paddingRight={2}>
						<Button
							variant="outlined"
							disabled={!isEmail}
							onClick={handleEmailLogin}
						>
						Login With Email Link
						</Button>
					</Box>
				</DialogActions>
				<DialogContent>
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
					<Link
						replace
						passHref
						shallow
						href={urlObj}
					>
						<Button color="error">
						Cancel
						</Button>
					</Link>
				</Box>
				<Button
					variant="outlined"
					disabled={!valid}
					onClick={handleLogin}
				>
					Login with Password
				</Button>
			</DialogActions>
		</>
	);
}
