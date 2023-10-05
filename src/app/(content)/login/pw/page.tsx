import LoginPwForm from './login-pw.form';
import Link from 'next/link';
import { Paths } from '@common/constants';
import {
	Button,
	DialogActions,
	DialogTitle,
} from '@ui';

export default function LoginModal() {
	return (
		<>
			<DialogTitle>
				Login
			</DialogTitle>
			<LoginPwForm />
			<DialogActions sx={{ justifyContent: 'center' }}>
				<Link href={Paths.ModalRegister} replace >
					<Button size="small">
						Create an Account
					</Button>
				</Link>
			</DialogActions>
		</>
	);
}
