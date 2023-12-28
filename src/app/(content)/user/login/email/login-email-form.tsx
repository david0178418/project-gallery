'use client';
import { useState } from 'react';
import { Key } from 'ts-key-enum';
import { useRouter } from 'next/navigation';
import { Paths } from '@common/constants';
import Link from 'next/link';
import oneClickSendAction from './one-click-send-action';
import TextField from '@components/common/text-field';
import { Button } from '@components/ui/button';
import { toast } from 'sonner';
import { useSetLoading } from '@components/loader';

export default
function LoginEmailForm() {
	const { replace } = useRouter();
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
			await oneClickSendAction(email);
			toast(`A login link will be sent to "${email}" if an account with this email exists.`);
			replace(Paths.Home);
		} catch(e) {
			toast('Something went wrong. Try again.');
			console.log(e);
		}

		setLoading(false);
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
						type="text"
						label="Email"
						value={email}
						onKeyUp={e => handleKeyUp(e.key)}
						onChange={e => setEmail(e.target.value)}
					/>
				</div>
			</form>
			<div className="flex items-end pr-2">
				<Link href={Paths.UserLoginPw} replace>
					<Button color="secondary">
							Sign in with password
					</Button>
				</Link>
				<Button
					variant="ghost"
					disabled={!valid}
					onClick={handleLogin}
				>
					Send email link
				</Button>
			</div>
		</>
	);
}
