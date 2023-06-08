import { useState } from 'react';
import { Key } from 'ts-key-enum';
import { sendLoginLink } from '@client/api-calls';
import { usePushToastMsg, useSetLoading } from '@common/atoms';
import { useRouter } from 'next/navigation';
import { Paths } from '@common/constants';
import Link from 'next/link';
import {
	Box,
	Button,
	DialogActions,
	DialogContent,
	TextField,
} from '@ui';

export default
function LoginEmailForm() {
	const { back } = useRouter();
	const pushToastMsg = usePushToastMsg();
	const setLoading = useSetLoading();
	const [email, setEmail] = useState('');
	const valid = email.includes('@');

	function handleKeyUp(key: string) {
		if(key === Key.Enter) {
			handleLogin();
		}
	}

	async function handleLogin() {
		setLoading(true);

		try {
			await sendLoginLink(email);
			pushToastMsg(`A login link will be sent to "${email}" if an account with this email exists.`);
			back();
		} catch(e) {
			pushToastMsg('Something went wrong. Try again.');
			console.log(e);
		}

		setLoading(false);
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
						label="Email"
						value={email}
						onKeyUp={e => handleKeyUp(e.key)}
						onChange={e => setEmail(e.target.value)}
					/>
				</DialogContent>
			</Box>
			<DialogActions>
				<Box paddingRight={2}>
					<Link href={Paths.ModalLoginPw} replace>
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
