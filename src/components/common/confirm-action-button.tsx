'use client';
import { useState } from 'react';
import { Button } from '@components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogOverlay,
	DialogTitle,
} from '@components/ui/dialog';

interface Props {
	label: string;
	confirmationMsg: string;
	onConfirm: () => void;
}

export default
function ConfirmActionButton(props: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const {
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
				variant="ghost"
				color="error"
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
