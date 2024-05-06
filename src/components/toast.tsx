'use client';
import { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import { CloseIcon } from '@components/icons';
import { toastManager } from '@common/atoms';
import { DefaultToastMsgDelay } from '@common/constants';

import { ToastMesssage } from '@common/types';
import { useEffectOnce } from '@common/hooks';

export default
function Toast() {
	const [toastMsg, setToastMsg] = useState<ToastMesssage | null>(null);
	const [isOpen, setOpen] = useState(false);
	const {
		delay = DefaultToastMsgDelay,
		message = '',
		onClose = () => {},
	} = toastMsg || {};

	useEffectOnce(() => {
		toastManager.subscribe(setToastMsg);

		return () => toastManager.unsubscribe();
	});

	useEffect(() => {
		setOpen(!!toastMsg);
	}, [toastMsg]);

	function handleClose() {
		setOpen(false);
		onClose();
	}

	return (
		<Snackbar
			open={isOpen}
			autoHideDuration={delay}
			onClose={handleClose}
			TransitionProps={{ onExited: toastManager.clearCurrentMessage }}
			message={message}
			action={
				<IconButton
					size="small"
					color="inherit"
					onClick={handleClose}
				>
					<CloseIcon fontSize="small" />
				</IconButton>
			}
		/>
	);
}
