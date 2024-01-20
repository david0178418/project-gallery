'use client';
import { useState } from 'react';
import { CloseIcon } from '@components/icons';
import {
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Tab,
	Tabs,
	useMediaQuery,
	useTheme,
} from '@mui/material';

// TODO Move out of "settings"
import LinkForm from '@app/(content)/project/[projectId]/edit/edit-project.form/link-form';
import { TextFieldLengthValidation } from '@components/common/text-field-length-validation';
import { CustomLinkValidator, CustomProfileItem } from '@common/types/CustomLink';
import { Key } from 'ts-key-enum';
import MarkdownContent from '@components/markdown-content';

interface EditCustomTextContentDialogProps {
	activeItem: CustomProfileItem | null;
	onClose(): void;
	onUpdate(customProfileItem: CustomProfileItem): void;
}

export
function EditCustomTextContentDialog(props: EditCustomTextContentDialogProps) {
	const {
		onUpdate,
		onClose,
		activeItem,
	} = props;
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

	return (
		<Dialog
			fullWidth
			open={!!activeItem}
			fullScreen={fullScreen}
			onClose={onClose}
		>
			<DialogTitle>
				Create Text Content
				<IconButton
					sx={{ float: 'right' }}
					onClick={onClose}
				>
					<CloseIcon/>
				</IconButton>
			</DialogTitle>
			<DialogContent>
				{activeItem && (
					<TextContentForm
						label={activeItem.label}
						value={activeItem.value}
						onUpdate={(label, value) => {
							onUpdate({
								label,
								value,
								type: 'text',
							});
						}}
					/>
				)}
			</DialogContent>
		</Dialog>
	);
}

interface EditCustomLinkDialogProps {
	activeItem: CustomProfileItem | null;
	onClose(): void;
	onUpdate(customProfileItem: CustomProfileItem): void;
}

export
function EditCustomLinkDialog(props: EditCustomLinkDialogProps) {
	const {
		onUpdate,
		onClose,
		activeItem,
	} = props;

	return (
		<Dialog
			open={!!activeItem}
			onClose={onClose}
		>
			<DialogTitle>
				Create Link
				<IconButton
					sx={{ float: 'right' }}
					onClick={onClose}
				>
					<CloseIcon/>
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ textAlign: 'right' }}>
				{activeItem && (
					<LinkForm
						focus
						label={activeItem.label}
						value={activeItem.value}
						onAdd={(label, value) => {
							onUpdate({
								label,
								value,
								type: 'link',
							});
						}}
					/>
				)}
			</DialogContent>
		</Dialog>
	);
}

interface TextContentFormProps {
	label: string;
	value: string;
	onUpdate(label: string, content: string): void;
}

function TextContentForm(props: TextContentFormProps) {
	const {
		label: rawLabel,
		value: rawValue,
		onUpdate,
	} = props;
	const [label, setLabel] = useState(rawLabel);
	const [value, setValue] = useState(rawValue);
	const [activeTabIndex, setActiveTabIndex] = useState(0);
	const previewIsOpen = activeTabIndex === 1;

	const validationResult = CustomLinkValidator.safeParse({
		value,
		label,
		type: 'text',
	});

	return (
		<>
			<TextFieldLengthValidation
				fullWidth
				autoFocus
				margin="dense"
				label="Label"
				value={label}
				onKeyUp={e => handleKeyUp(e.key)}
				onChange={e => setLabel(e.target.value)}
			/>
			<Tabs value={activeTabIndex} onChange={(e, val) => setActiveTabIndex(val)}>
				<Tab label="Content" />
				<Tab label="Preview" />
			</Tabs>
			<Box display={previewIsOpen ? 'none' : 'block'}>
				<TextFieldLengthValidation
					fullWidth
					multiline
					label=""
					margin="dense"
					minRows={3}
					maxRows={15}
					value={value}
					onChange={e => setValue(e.target.value)}
				/>
			</Box>
			{previewIsOpen && (
				<MarkdownContent>
					{value}
				</MarkdownContent>
			)}
			<Box textAlign="right" paddingTop={2}>
				<Button
					variant="contained"
					disabled={!validationResult.success}
					onClick={handleAdd}
				>
					Add Content
				</Button>
			</Box>
		</>
	);

	function handleKeyUp(key: string) {
		if(key === Key.Enter && validationResult.success) {
			handleAdd();
		}
	}

	function handleAdd() {
		onUpdate(label, value);
		setLabel('');
		setValue('');
	}
}
