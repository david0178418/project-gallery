'use client';
import { useState } from 'react';
import { Key } from 'ts-key-enum';
import { login } from '@client/api-calls';
import { useSetAtom } from 'jotai';
import { loadingAtom, pushToastMsgAtom } from '@common/atoms';
import Link from 'next/link';
import { CloseIcon } from '@components/icons';
import { redirect, useRouter } from 'next/navigation';
import { Paths } from '@common/constants';
import Register from '@server/actions/register';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	TextField,
	useMediaQuery,
	useTheme,
} from '@ui';

export default
function RegistrationModal() {
	const { back } = useRouter();
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
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
			const result = await Register({
				username,
				email,
				password,
			});

			if(result.ok && await login(username, password)) {
				pushToastMsg(`Logged in as ${username}`);
				setUsername('');
				setEmail('');

				redirect(Paths.Home);
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
		<Dialog
			open
			fullScreen={fullScreen}
			fullWidth
		>
			<DialogTitle>
				Create Account
				<IconButton
					onClick={back}
					sx={{
						position: 'absolute',
						right: 8,
						top: 8,
					}}
				>
					<CloseIcon />
				</IconButton>
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
			<DialogActions style={{ justifyContent: 'center' }}>
				<Link
					shallow
					replace
					href={Paths.ModalLoginEmail}
				>
					<Button size="small">
						Login with Existing Account
					</Button>
				</Link>
			</DialogActions>
		</Dialog>
	);
}
