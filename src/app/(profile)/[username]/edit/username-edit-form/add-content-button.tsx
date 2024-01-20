'use client';
import { useState } from 'react';
import { AddIcon } from '@components/icons';
import { Button, ButtonGroup } from '@mui/material';

// TODO Move out of "settings"
import { CustomProfileItem } from '@common/types/CustomLink';
import { EditCustomLinkDialog, EditCustomTextContentDialog } from './edit-custom-content-dialog';

interface Props {
	onAddContent(customProfileItem: CustomProfileItem): void;
}

export default
function AddContentButton({ onAddContent }: Props) {
	const [activeItem, setActiveItem] = useState<CustomProfileItem | null>(null);

	return (
		<>
			<ButtonGroup
				fullWidth
				size="large"
				variant="outlined"
				sx={{
					borderStyle: 'dashed',
					color: 'green',
					maxWidth: 600,
					marginBottom: 3,
					borderWidth: 1,
				}}
			>
				<Button
					size="large"
					variant="outlined"
					color="inherit"
					sx={{
						border: 'none',
						fontSize: 20,
					}}
					startIcon={<AddIcon />}
					onClick={() => setActiveItem({
						label: '',
						value: '',
						type: 'link',
					})}
				>
					Add Link
				</Button>
				<Button
					size="large"
					variant="outlined"
					color="inherit"
					sx={{
						border: 'none',
						fontSize: 20,
						borderLeft: '1px solid',
					}}
					startIcon={<AddIcon />}
					onClick={() => setActiveItem({
						label: '',
						value: '',
						type: 'text',
					})}
				>
					Add Text
				</Button>
			</ButtonGroup>
			<EditCustomTextContentDialog
				onUpdate={handleAdd}
				activeItem={activeItem?.type === 'text' ? activeItem : null}
				onClose={handleClose}
			/>
			<EditCustomLinkDialog
				activeItem={activeItem?.type === 'link' ? activeItem : null}
				onClose={handleClose}
				onUpdate={handleAdd}
			/>
		</>
	);

	function handleAdd(item: CustomProfileItem) {
		onAddContent(item);
		handleClose();
	}

	function handleClose() {
		setActiveItem(null);
	}
}
