import LoginPwForm from '@components/login-pw.form';
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
			<DialogActions style={{ justifyContent: 'center' }}>
				<Link href={Paths.ModalRegister} replace >
					<Button size="small">
						Login Existing Account
					</Button>
				</Link>
			</DialogActions>
		</>
	);
}
