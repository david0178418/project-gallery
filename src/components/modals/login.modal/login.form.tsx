import { useState } from 'react';
import { Key } from 'ts-key-enum';
import { login } from '@client/api-calls';
import { useSetAtom } from 'jotai';
import { loadingAtom, pushToastMsgAtom } from '@common/atoms';
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
import { Paths } from '@common/constants';

interface Props {
	urlObj: UrlObject;
}

export
function LoginForm(props: Props) {
	const { urlObj } = props;
	const pushToastMsg = useSetAtom(pushToastMsgAtom);
	const setLoading = useSetAtom(loadingAtom);
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

	return (
		<>
			<DialogTitle>
				Login
			</DialogTitle>
			<DialogContent>
				<Box
					noValidate
					autoComplete="off"
					component="form"
				>
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
					<TextField
						fullWidth
						label="Password"
						variant="standard"
						type="password"
						value={password}
						onKeyUp={e => handleKeyUp(e.key)}
						onChange={e => setPassword(e.target.value)}
					/>
				</Box>
			</DialogContent>
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
				<Box paddingRight={2}>
					<Link href={Paths.OneClickAuthSend(usernameOrEmail)}>
						<Button
							variant="outlined"
							disabled={!isEmail}
						>
						Login With Email
						</Button>
					</Link>
				</Box>
				<Button
					variant="outlined"
					disabled={!valid}
					onClick={handleLogin}
				>
					Login
				</Button>
			</DialogActions>
		</>
	);
}
