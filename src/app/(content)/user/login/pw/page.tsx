import LoginPwForm from './login-pw-form';
import Link from 'next/link';
import { Paths } from '@common/constants';
import { Button } from '@components/ui/button';

export default function LoginModal() {
	return (
		<>
			<div className="strong">
				Login
			</div>
			<LoginPwForm />
			<div className="flex justify-center">
				<Link href={Paths.UserRegister} replace >
					<Button>
						Create an Account
					</Button>
				</Link>
			</div>
		</>
	);
}
