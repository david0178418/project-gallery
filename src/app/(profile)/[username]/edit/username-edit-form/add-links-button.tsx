'use client';
import { ProfileButton } from '@components/profile-button';
import { useState } from 'react';
import { AddIcon, CloseIcon } from '@components/icons';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
} from '@mui/material';

// TODO Move out of "settings"
import LinkForm from '@app/(content)/project/[projectId]/edit/edit-project.form/link-form';

interface Props {
	onAddLink(label: string, url: string): void;
}

export default
function AddLinks({ onAddLink }: Props) {
	const [open, setIsOpen] = useState(false);

	return (
		<>
			<ProfileButton
				icon={AddIcon}
				onClick={() => setIsOpen(true)}
				sx={{
					borderStyle: 'dashed',
					color: 'green',
				}}
			>
				Add Link
			</ProfileButton>
			<Dialog
				open={open}
				onClose={() => setIsOpen(false)}
			>
				<DialogTitle>
					Create Link
					<IconButton
						sx={{ float: 'right' }}
						onClick={() => setIsOpen(false)}
					>
						<CloseIcon/>
					</IconButton>
				</DialogTitle>
				<DialogContent sx={{ textAlign: 'right' }}>
					<LinkForm
						focus
						onAdd={(label, url) => {
							onAddLink(label, url);
							setIsOpen(false);
						}}
					/>
				</DialogContent>
			</Dialog>
		</>
	);
}
