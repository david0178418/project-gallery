import { useEffect, useState } from 'react';
import { clearCurrentToastMsgAtom, toastMsgAtom } from '@common/atoms';
import { DefaultToastMsgDelay } from '@common/constants';
import { useAtomValue, useSetAtom } from 'jotai';
import {
	Toast as ShadCnToast,
	ToastTitle,
	ToastClose,
	ToastDescription,
} from '@/components/ui/toast';

export default
function Toast() {
	const toastMsg = useAtomValue(toastMsgAtom);
	const clearMsg = useSetAtom(clearCurrentToastMsgAtom);
	const [isOpen, setOpen] = useState(false);
	const {
		delay = DefaultToastMsgDelay,
		message = '',
		title = '',
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
		<>
			<ShadCnToast
				open={isOpen}
				duration={delay}
				onOpenChange={newOpenState => !newOpenState && clearMsg()}
			>
				<div className="grid gap-1">
					{title && (
						<ToastTitle>
							{title}
						</ToastTitle>
					)}
					{message && (
						<ToastDescription>
							{message}
						</ToastDescription>
					)}
				</div>
				{message}
				<ToastClose onClick={handleClose} />
			</ShadCnToast>
		</>
	);
}
