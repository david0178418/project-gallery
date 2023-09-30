import { Button } from '@ui';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import LogoutButton from './logout-button';

export
function LoginBtn() {
	const { data: session } = useSession();

	if (session) {
		return (
			<>
				Signed in as {session.user.username}
				<LogoutButton />
			</>
		);
	}
	return (
		<Link href="/login/email">
			<Button>Login</Button>
		</Link>
	);
}
