import LoginEmailForm from '@components/login-email.form';
import { Paths } from '@common/constants';
import {
	Button,
	DialogActions,
	DialogTitle,
} from '@ui';
import Link from 'next/link';

export default function LoginModal() {
	return (
		<>
			<DialogTitle>
				Login
			</DialogTitle>
			<LoginEmailForm />
			<DialogActions style={{ justifyContent: 'center' }}>
				<Link replace href={Paths.ModalRegister} >
					<Button size="small" >
						Create an Account
					</Button>
				</Link>
			</DialogActions>
		</>
	);
}
