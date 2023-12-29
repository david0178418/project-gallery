'use client';
import { useState } from 'react';
import { Key } from 'ts-key-enum';
import { login } from '@client/api-calls';
import { inRange } from '@common/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TextField from '@components/common/text-field';
import { Button } from '@components/ui/button';
import { toast } from 'sonner';
import { useSetLoading } from '@components/loader';
import {
	Paths,
	UsernameMaxLength,
	UsernameMinLength,
} from '@common/constants';

export default
function LoginPwForm() {
	const setLoading = useSetLoading();
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

		setLoading(true);

		try {
			const results = await login(usernameOrEmail, password);

			if(results?.ok) {
				toast(`Logged in as ${usernameOrEmail}`);
				refresh();
			} else {
				toast('Incorrect Login');
			}

		} catch(e) {
			toast('Something went wrong. Try again.');
			console.log(e);
		}

		setLoading(false);
		setPassword('');
	}

	return (
		<>
			<form
				noValidate
				autoComplete="off"
			>
				<div>
					<TextField
						autoFocus
						className="w-full"
						placeholder="username"
						type="text"
						label="Username or Email"
						value={usernameOrEmail}
						onKeyUp={e => handleKeyUp(e.key)}
						onChange={e => setUsernameOrEmail(e.target.value)}
					/>
					<TextField
						className="w-full"
						label="Password"
						type="password"
						value={password}
						onKeyUp={e => handleKeyUp(e.key)}
						onChange={e => setPassword(e.target.value)}
					/>
				</div>
			</form>
			<div className="pt-3 grid gap-1 text-center">
				<Button
					className="w-full"
					disabled={!valid}
					onClick={handleLogin}
				>
						Sign in
				</Button>
				<Link href={Paths.UserLoginEmail} replace>
					<Button variant="link">
							Sign in with Email Link
					</Button>
				</Link>
			</div>
		</>
	);
}
