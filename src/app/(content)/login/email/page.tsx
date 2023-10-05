import LoginEmailForm from './login-email.form';
import { Paths } from '@common/constants';
import Link from 'next/link';
import {
	Button,
	DialogActions,
	DialogTitle,
} from '@ui';

export default function LoginPage() {
	return (
		<>
			<DialogTitle>
				Login
			</DialogTitle>
			<LoginEmailForm />
			<DialogActions sx={{ justifyContent: 'center' }}>
				<Link replace href={Paths.ModalRegister} >
					<Button size="small" >
						Create an Account
					</Button>
				</Link>
			</DialogActions>
		</>
	);
}
