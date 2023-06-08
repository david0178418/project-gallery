'use client';
import LoginEmailForm from '@components/login-email.form';
import { useRouter } from 'next/navigation';
import { CloseIcon } from '@components/icons';
import { Paths } from '@common/constants';
import {
	Button,
	Dialog,
	DialogActions,
	DialogTitle,
	IconButton,
	useMediaQuery,
	useTheme,
} from '@ui';
import Link from 'next/link';

export default function LoginModal() {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
	const { back } = useRouter();

	return (
		<Dialog
			open
			fullWidth
			fullScreen={fullScreen}
		>
			<DialogTitle>
				Login
				<IconButton
					onClick={back}
					sx={{
						position: 'absolute',
						right: 8,
						top: 8,
					}}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<LoginEmailForm />
			<DialogActions style={{ justifyContent: 'center' }}>
				<Link replace href={Paths.ModalRegister} >
					<Button size="small" >
							Create an Account
					</Button>
				</Link>
			</DialogActions>
		</Dialog>
	);
}
