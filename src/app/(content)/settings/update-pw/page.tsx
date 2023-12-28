'use client';
import { useState } from 'react';
import { PasswordMaxLength, PasswordMinLength } from '@common/constants';
import { useSetAtom } from 'jotai';
import { loadingAtom } from '@common/atoms';
import { ConfirmButton } from '@components/common/buttons';
import updatePassword from './update-pw-action';
import TextField from '@components/common/text-field';
import { toast } from 'sonner';

export default
function UpdatePwPage() {
	const setLoading = useSetAtom(loadingAtom);
	const [touched, setTouched] = useState(false);
	const [pw, setPw] = useState('');
	const [pw2, setPw2] = useState('');
	const pwMatch = pw === pw2;
	const pwLongEnough = pw.length >= PasswordMinLength;
	const pwShortEnough = pw.length <= PasswordMaxLength;
	const canSave = pwMatch && pwLongEnough && pwShortEnough;
	let error = '';

	if(touched) {
		if(!pwShortEnough) {
			error = `Password must have no more than ${PasswordMaxLength} characters`;
		} else if(!pwLongEnough) {
			error = `Password must be at least ${PasswordMinLength} characters`;
		} else if(!pwMatch) {
			error = 'Passwords must match';
		}
	}

	async function handleUpdate() {
		try {
			setLoading(true);
			await updatePassword(pw);
			toast('Password updated!');
		} catch(e: any) {
			const { errors = ['Something went wrong. Try again.'] } = e;

			errors.map((msg: string) => toast(msg));
			console.log(e);
		}

		setLoading(false);
	}

	return (
		<>
			<div className="font-bold">
				Update Password
			</div>
			<div className="grid grid-cols-1 row-sp gap-2"
				// columns={{ xs: 1 }}
			>
				<div>
					<TextField
						autoComplete="off"
						label="New Password"
						type="password"
						value={pw}
						error={!!error}
						helperText={error}
						onBlur={() => setTouched(true)}
						onChange={e => setPw(e.target.value)}
					/>
				</div>
				<div>
					<TextField
						autoComplete="off"
						label="Confirm Password"
						type="password"
						value={pw2}
						onChange={e => setPw2(e.target.value)}
					/>
				</div>
				<div>
					<ConfirmButton disabled={!canSave} onClick={handleUpdate}>
						Save New Password
					</ConfirmButton>
				</div>
			</div>
		</>
	);
}
