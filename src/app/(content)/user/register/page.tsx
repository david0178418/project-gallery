'use client';
import { useState } from 'react';
import { Key } from 'ts-key-enum';
import { login } from '@client/api-calls';
import { useSetAtom } from 'jotai';
import { loadingAtom, pushToastMsgAtom } from '@common/atoms';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Paths } from '@common/constants';
import Register from '@server/actions/register';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

export default
function RegistrationModal() {
	const pushToastMsg = useSetAtom(pushToastMsgAtom);
	const setLoading = useSetAtom(loadingAtom);
	const [username, setUsername] = useState('');
	const [displayName, setDisplayName] = useState('');
	const { replace } = useRouter();
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
			const result = await Register({
				username,
				displayName,
				email,
				password,
			});

			if(result.errors) {
				result.errors.map(pushToastMsg);
				console.error(result.errors);
			} else if(await login(username, password)) {
				pushToastMsg(`Logged in as ${username}`);
				setUsername('');
				setEmail('');
				replace(Paths.UserGallery(username));
			}
		} catch(e: any) {
			const { errors = ['Something went wrong. Try again.'] } = e;

			errors.map(pushToastMsg);
			console.error(e);
		}

		setPassword('');
		setRepassword('');
		setLoading(false);
	}

	return (
		<>
			<DialogTitle>
				Create Account
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
						type="text"
						value={username}
						onKeyUp={e => handleKeyUp(e.key)}
						onChange={e => setUsername(e.target.value)}
					/>
					<TextField
						autoFocus
						fullWidth
						label="Display name"
						variant="standard"
						type="text"
						value={displayName}
						onKeyUp={e => handleKeyUp(e.key)}
						onChange={e => setDisplayName(e.target.value)}
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
			<DialogActions style={{ justifyContent: 'center' }}>
				<Link
					shallow
					replace
					href={Paths.UserLoginEmail}
				>
					<Button size="small">
						Login with Existing Account
					</Button>
				</Link>
			</DialogActions>
		</>
	);
}
