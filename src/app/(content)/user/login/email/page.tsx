import LoginEmailForm from './login-email-form';
import { Paths } from '@common/constants';
import Link from 'next/link';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

export default function LoginPage() {
	return (
		<>
			<DialogTitle>
				Login
			</DialogTitle>
			<LoginEmailForm />
			<DialogActions sx={{ justifyContent: 'center' }}>
				<Link replace href={Paths.UserRegister} >
					<Button size="small" >
						Create an Account
					</Button>
				</Link>
			</DialogActions>
		</>
	);
}
