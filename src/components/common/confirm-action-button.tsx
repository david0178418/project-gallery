'use client';
import { ComponentProps, useState } from 'react';
import { Button } from '@components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogOverlay,
	DialogTitle,
} from '@components/ui/dialog';

interface Props extends Pick<ComponentProps<typeof Button>, 'variant' | 'size'> {
	label: string;
	confirmationMsg: string;
	onConfirm: () => void;
}

export default
function ConfirmActionButton(props: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const {
		variant = 'ghost',
		size,
		label,
		onConfirm,
		confirmationMsg,
	} = props;

	async function handleConfirm() {
		await onConfirm();
		setIsOpen(false);
	}

	return (
		<>
			<Button
				variant={variant}
				size={size}
				onClick={() => setIsOpen(true)}
			>
				{label}
			</Button>
			<Dialog open={isOpen}>
				<DialogOverlay />
				<DialogContent>
					<DialogTitle>
						{label}
					</DialogTitle>
					<DialogContent>
						<DialogDescription>
							{confirmationMsg}
						</DialogDescription>
					</DialogContent>
					<DialogFooter>
						<Button color="error" onClick={() => setIsOpen(false)}>
							Cancel
						</Button>
						<Button onClick={(handleConfirm)}>
							{label}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
