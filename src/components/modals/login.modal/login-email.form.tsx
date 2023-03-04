import { useState } from 'react';
import { Key } from 'ts-key-enum';
import { sendLoginLink } from '@client/api-calls';
import { usePushToastMsg, useSetLoading } from '@common/atoms';
import Link from 'next/link';
import { UrlObject } from 'url';
import { useRouter } from 'next/router';
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
	onToggle(): void;
}

export default
function LoginEmailForm(props: Props) {
	const {
		onToggle,
		urlObj,
	} = props;
	const { replace } = useRouter();
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
						label="Email"
						value={email}
						onKeyUp={e => handleKeyUp(e.key)}
						onChange={e => setEmail(e.target.value)}
					/>
				</DialogContent>
			</Box>
			<DialogActions>
				<Box paddingRight={2}>
					<Button color="secondary" onClick={onToggle}>
						Sign in with password
					</Button>
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
