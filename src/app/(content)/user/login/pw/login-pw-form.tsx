'use client';
import { useState } from 'react';
import { Key } from 'ts-key-enum';
import { login } from '@client/api-calls';
import { inRange } from '@common/utils';
import Link from 'next/link';
import { usePushToastMsg, useSetLoading } from '@common/atoms';
import { useRouter } from 'next/navigation';
import TextField from '@components/common/text-field';
import { Button } from '@components/ui/button';
import {
	Paths,
	UsernameMaxLength,
	UsernameMinLength,
} from '@common/constants';

export default
function LoginPwForm() {
	const pushToastMsg = usePushToastMsg();
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
				pushToastMsg(`Logged in as ${usernameOrEmail}`);
				refresh();
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
			<div className="flex justify-end pr-2">
				<Link href={Paths.UserLoginEmail} replace>
					<Button color="secondary">
							Sign in with Email Link
					</Button>
				</Link>
				<Button
					variant="ghost"
					disabled={!valid}
					onClick={handleLogin}
				>
					Sign in
				</Button>
			</div>
		</>
	);
}
