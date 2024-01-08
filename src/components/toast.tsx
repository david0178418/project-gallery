'use client';
import { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import { CloseIcon } from '@components/icons';
import { clearCurrentToastMsgAtom, toastMsgAtom } from '@common/atoms';
import { DefaultToastMsgDelay } from '@common/constants';
import {
	useAtomValue,
	useSetAtom,
} from 'jotai';

export default
function Toast() {
	const toastMsg = useAtomValue(toastMsgAtom);
	const clearMsg = useSetAtom(clearCurrentToastMsgAtom);
	const [isOpen, setOpen] = useState(false);
	const {
		delay = DefaultToastMsgDelay,
		message = '',
		onClose = () => {},
	} = toastMsg || {};

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
			TransitionProps={{ onExited: clearMsg }}
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
