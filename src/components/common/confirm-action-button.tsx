'use client';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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
				variant="outlined"
				color="error"
				onClick={() => setIsOpen(true)}
			>
				{label}
			</Button>
			<Dialog open={isOpen}>
				<DialogTitle>
					{label}
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{confirmationMsg}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button color="error" onClick={() => setIsOpen(false)}>
						Cancel
					</Button>
					<Button onClick={(handleConfirm)}>
						{label}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
