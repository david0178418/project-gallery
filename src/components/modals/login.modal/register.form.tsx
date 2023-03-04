import type { UrlObject } from 'url';

import { useState } from 'react';
import { Key } from 'ts-key-enum';
import { login, register } from '@client/api-calls';
import { useSetAtom } from 'jotai';
import { loadingAtom, pushToastMsgAtom } from '@common/atoms';
import Link from 'next/link';
import { CloseIcon } from '@components/icons';
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
function RegistrationForm(props: Props) {
	const { urlObj } = props;
	const pushToastMsg = useSetAtom(pushToastMsgAtom);
	const setLoading = useSetAtom(loadingAtom);
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [repassword, setRepassword] = useState('');
	const valid = !!(
		username &&
		email &&
		password && (
			password === repassword
		)
	);

	function handleKeyUp(key: string) {
		if(key === Key.Enter) {
			handleRegister();
		}
	}

	async function handleRegister() {
		if(!valid) {
			return;
		}

		setLoading(true);

		try {
			if(
				await register(username, email, password) &&
				await login(username, password)
			) {
				pushToastMsg(`Logged in as ${username}`);
				setUsername('');
				setEmail('');
			}
		} catch(e: any) {
			const { errors = ['Something went wrong. Try again.'] } = e;

			errors.map(pushToastMsg);
			console.log(e);
		}

		setPassword('');
		setRepassword('');
		setLoading(false);
	}

	return (
		<>
			<DialogTitle>
				Create Account

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
			<DialogContent>
				<Box
					noValidate
					autoComplete="off"
					component="form"
				>
					<TextField
						autoFocus
						fullWidth
						label="Username"
						variant="standard"
						placeholder="username"
						type="text"
						value={username}
						onKeyUp={e => handleKeyUp(e.key)}
						onChange={e => setUsername(e.target.value)}
					/>
					<TextField
						autoFocus
						fullWidth
						label="Email"
						variant="standard"
						placeholder="email"
						type="email"
						value={email}
						onKeyUp={e => handleKeyUp(e.key)}
						onChange={e => setEmail(e.target.value)}
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
					<TextField
						fullWidth
						label="Re-enter Password"
						variant="standard"
						type="password"
						value={repassword}
						onKeyUp={e => handleKeyUp(e.key)}
						onChange={e => setRepassword(e.target.value)}
					/>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button
					variant="outlined"
					disabled={!valid}
					onClick={handleRegister}
				>
					Register
				</Button>
			</DialogActions>
		</>
	);
}
