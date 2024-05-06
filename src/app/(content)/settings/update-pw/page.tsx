'use client';
import { useState } from 'react';
import { PasswordMaxLength, PasswordMinLength } from '@common/constants';
import { loadingManager, toastManager } from '@common/atoms';
import { ConfirmButton } from '@components/common/buttons';
import updatePassword from './update-pw-action';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export default
function UpdatePwPage() {
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
			loadingManager.show();
			await updatePassword(pw);
			toastManager.pushMessage('Password updated!');
		} catch(e: any) {
			const { errors = ['Something went wrong. Try again.'] } = e;

			errors.map(toastManager.pushMessage);
			console.log(e);
		}

		loadingManager.hide();
	}

	return (
		<>
			<Typography variant="h6">
				Update Password
			</Typography>
			<Grid
				container
				rowSpacing={1}
				columnSpacing={1}
				columns={{ xs: 1 }}
			>
				<Grid item xs={1}>
					<TextField
						autoComplete="off"
						label="New Password"
						variant="standard"
						type="password"
						value={pw}
						error={!!error}
						helperText={error}
						onBlur={() => setTouched(true)}
						onChange={e => setPw(e.target.value)}
					/>
				</Grid>
				<Grid item xs={1}>
					<TextField
						autoComplete="off"
						label="Confirm Password"
						variant="standard"
						type="password"
						value={pw2}
						onChange={e => setPw2(e.target.value)}
					/>
				</Grid>
				<Grid item xs={1}>
					<ConfirmButton disabled={!canSave} onClick={handleUpdate}>
						Save New Password
					</ConfirmButton>
				</Grid>
			</Grid>
		</>
	);
}
