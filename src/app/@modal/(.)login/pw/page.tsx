'use client';
import LoginPwForm from '@components/login-pw.form';
import { useRouter } from 'next/navigation';
import { CloseIcon } from '@components/icons';
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
import { Paths } from '@common/constants';

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
			<LoginPwForm />
			<DialogActions style={{ justifyContent: 'center' }}>
				<Link href={Paths.ModalRegister} replace >
					<Button size="small">
						Create an Account
					</Button>
				</Link>
			</DialogActions>
		</Dialog>
	);
}
