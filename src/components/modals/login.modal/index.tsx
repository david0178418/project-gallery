import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ModalActions } from '@common/constants';
import { useIsLoggedIn } from '@common/hooks';

import Link from 'next/link';
import {
	Button,
	Dialog,
	DialogActions,
	useMediaQuery,
	useTheme,
} from '@ui';
import LoginEmailForm from '@components/login-email.form';
import LoginPwForm from '@components/login-pw.form';

export default
function LoginModal() {
	const isLoggedIn = useIsLoggedIn();
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
	const [isEmailLogin] = useState(false);
	const {
		pathname,
		query,
		replace,
	} = useRouter();
	const {
		a: action,
		...newQuery
	} = query;
	// const urlObj = {
	// 	pathname,
	// 	query: newQuery,
	// };
	const actionIsLogin = action === ModalActions.Login;
	const isOpen = actionIsLogin && !isLoggedIn;

	useEffect(() => {
		if(!actionIsLogin) {
			return;
		}

		if(isLoggedIn) {
			replace({
				pathname,
				query: newQuery,
			});
		}
	}, [actionIsLogin, isLoggedIn]);

	return (
		<>
			<Dialog
				open={isOpen}
				fullScreen={fullScreen}
				fullWidth
			>
				{isEmailLogin && (
					<LoginEmailForm
						// urlObj={urlObj} onToggle={() => setIsEmailLogin(false)}
					/>
				)}
				{!isEmailLogin && (
					<LoginPwForm
						// urlObj={urlObj} onToggle={() => setIsEmailLogin(true)}
					/>
				)}
				<DialogActions style={{ justifyContent: 'center' }}>
					<Link
						shallow
						href={{
							pathname,
							query: {
								...query,
								a: ModalActions.Register,
							},
						}}
					>
						<Button size="small">
							Create an Account
						</Button>
					</Link>
				</DialogActions>
			</Dialog>
		</>
	);
}
