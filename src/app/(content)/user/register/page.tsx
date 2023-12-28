'use client';
import { useState } from 'react';
import { Key } from 'ts-key-enum';
import { login } from '@client/api-calls';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Paths } from '@common/constants';
import Register from '@server/actions/register';
import TextField from '@components/common/text-field';
import { Button } from '@components/ui/button';
import { toast } from 'sonner';
import { useSetLoading } from '@components/loader';

export default
function RegistrationModal() {
	const setLoading = useSetLoading();
	const [username, setUsername] = useState('');
	const { refresh } = useRouter();
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
				toast(`Logged in as ${username}`);
				setUsername('');
				setEmail('');

				refresh();
			}
		} catch(e: any) {
			const { errors = ['Something went wrong. Try again.'] } = e;

			errors.map((msg: string) => toast(msg));
			console.log(e);
		}

		setPassword('');
		setRepassword('');
		setLoading(false);
	}

	return (
		<>
			<div className="font-bold">
				Create Account
			</div>
			<div>
				<form
					noValidate
					autoComplete="off"
				>
					<TextField
						autoFocus
						className="w-full"
						label="Username"
						placeholder="username"
						type="text"
						value={username}
						onKeyUp={e => handleKeyUp(e.key)}
						onChange={e => setUsername(e.target.value)}
					/>
					<TextField
						autoFocus
						className="w-full"
						label="Email"
						placeholder="email"
						type="email"
						value={email}
						onKeyUp={e => handleKeyUp(e.key)}
						onChange={e => setEmail(e.target.value)}
					/>
					<TextField
						className="w-full"
						label="Password"
						type="password"
						value={password}
						onKeyUp={e => handleKeyUp(e.key)}
						onChange={e => setPassword(e.target.value)}
					/>
					<TextField
						className="w-full"
						label="Re-enter Password"
						type="password"
						value={repassword}
						onKeyUp={e => handleKeyUp(e.key)}
						onChange={e => setRepassword(e.target.value)}
					/>
				</form>
			</div>
			<div className="flex justify-end">
				<Button
					variant="ghost"
					disabled={!valid}
					onClick={handleRegister}
				>
					Register
				</Button>
			</div>
			<div className="flex justify-center">
				<Link
					shallow
					replace
					href={Paths.UserLoginEmail}
				>
					<Button>
						Login with Existing Account
					</Button>
				</Link>
			</div>
		</>
	);
}
