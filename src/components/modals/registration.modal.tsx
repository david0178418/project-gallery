import { useEffect, useState } from 'react';
import { Key } from 'ts-key-enum';
import { login, register } from '@client/api-calls';
import { useSetAtom } from 'jotai';
import { loadingAtom, pushToastMsgAtom } from '@common/atoms';
import Link from 'next/link';
import { CloseIcon } from '@components/icons';
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
} from '@mui/material';
import { useIsLoggedIn } from '@common/hooks';
import { useRouter } from 'next/router';
import { ModalActions } from '@common/constants';

export default
function RegistrationModal() {
	const isLoggedIn = useIsLoggedIn();
	const {
		pathname,
		query,
		replace,
	} = useRouter();
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
	const {
		a: action,
		...newQuery
	} = query;
	const urlObj = {
		pathname,
		query: newQuery,
	};
	const actionIsRegister = action === ModalActions.Register;
	const isOpen = actionIsRegister && !isLoggedIn;

	useEffect(() => {
		if(!actionIsRegister) {
			return;
		}

		if(isLoggedIn) {
			replace({
				pathname,
				query: newQuery,
			});
		}
	}, [actionIsRegister, isLoggedIn]);

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
			<Dialog
				open={isOpen}
				fullScreen={fullScreen}
				fullWidth
			>

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
				<DialogActions style={{ justifyContent: 'center' }}>
					<Link
						shallow
						href={{
							pathname,
							query: {
								...query,
								a: ModalActions.Login,
							},
						}}
					>
						<Button size="small">
							Login with Existing Account
						</Button>
					</Link>
				</DialogActions>
			</Dialog>
		</>
	);
}
