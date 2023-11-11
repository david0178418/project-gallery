import LoginEmailForm from './login-email-form';
import { Paths } from '@common/constants';
import Link from 'next/link';
import { Button } from '@components/ui/button';

export default function LoginPage() {
	return (
		<>
			<div className="font-bold">
				Login
			</div>
			<LoginEmailForm />
			<div className="justify-center">
				<Link replace href={Paths.UserRegister} >
					<Button>
						Create an Account
					</Button>
				</Link>
			</div>
		</>
	);
}
