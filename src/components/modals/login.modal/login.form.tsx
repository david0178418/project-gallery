import { useState } from 'react';
import { Key } from 'ts-key-enum';
import { login, sendLoginLink } from '@client/api-calls';
import { usePushToastMsg, useSetLoading } from '@common/atoms';
import Link from 'next/link';
import { UrlObject } from 'url';
import { useRouter } from 'next/router';
import { CloseIcon } from '@components/icons';
import { inRange } from '@common/utils';
import { UsernameMaxLength, UsernameMinLength } from '@common/constants';
import {
	Box,
	Button,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	TextField,
} from '@mui/material';

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
	const [loginEmail, setLoginEmail] = useState(false);
	const isEmail = usernameOrEmail.includes('@');
	const validUsernameLength = inRange(usernameOrEmail.length, UsernameMinLength, UsernameMaxLength, true);
	const valid = !!(
		(
			loginEmail &&
			isEmail
		) || (
			password &&
			usernameOrEmail &&
			validUsernameLength
		)
	);

	function handleKeyUp(key: string) {
		if(key === Key.Enter) {
			handleLogin();
		}
	}

	function handleLogin() {
		loginEmail ?
			handleEmailLogin() :
			handlePWLogin();
	}

	async function handlePWLogin() {
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

				<Link
					replace
					shallow
					href={urlObj}
				>
					<IconButton
						sx={{
							position: 'absolute',
							right: 8,
							top: 8,
						}}
					>
						<CloseIcon />
					</IconButton>
				</Link>
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
						variant="standard"
						placeholder="username"
						type="text"
						label={loginEmail ? 'Email' : 'Username or Email'}
						value={usernameOrEmail}
						onKeyUp={e => handleKeyUp(e.key)}
						onChange={e => setUsernameOrEmail(e.target.value)}
					/>
					{!loginEmail && (
						<TextField
							fullWidth
							label="Password"
							variant="standard"
							type="password"
							value={password}
							onKeyUp={e => handleKeyUp(e.key)}
							onChange={e => setPassword(e.target.value)}
						/>
					)}
				</DialogContent>
			</Box>
			<DialogActions>
				<Box paddingRight={2}>
					<Button color="secondary" onClick={() => setLoginEmail(!loginEmail)}>
						Sign in with { loginEmail ? 'password' : 'email'}
					</Button>
				</Box>
				<Button
					variant="outlined"
					disabled={!valid}
					onClick={handleLogin}
				>
					{loginEmail ? 'Send email link' : 'Sign in'}
				</Button>
			</DialogActions>
		</>
	);
}
