import { Paths } from '@common/constants';
import { Button } from '@components/ui/button';
import Link from 'next/link';
import { ReactNode } from 'react';

interface Props {
	children: ReactNode;
}

export default function LoginModal(props: Props) {
	return (
		<>
			<div className="text-center">
				<div className="inline-block text-left">
					<div className="font-bold text-lg">
						Login
					</div>
					{props.children}
					<div className="text-center">
						<Link href={Paths.UserRegister} replace >
							<Button variant="link">
								Create an Account
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
