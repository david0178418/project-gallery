import LoginPwForm from './login-pw-form';
import Link from 'next/link';
import { Paths } from '@common/constants';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

export default function LoginModal() {
	return (
		<>
			<DialogTitle>
				Login
			</DialogTitle>
			<LoginPwForm />
			<DialogActions sx={{ justifyContent: 'center' }}>
				<Link href={Paths.UserRegister} replace >
					<Button size="small">
						Create an Account
					</Button>
				</Link>
			</DialogActions>
		</>
	);
}
