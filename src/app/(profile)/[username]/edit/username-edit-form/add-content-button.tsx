'use client';
import { useState } from 'react';
import { AddIcon, CloseIcon } from '@components/icons';
import {
	Box,
	Button,
	ButtonGroup,
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

interface Props {
	onAddContent(customProfileItem: CustomProfileItem): void;
}

export default
function AddContentButton({ onAddContent }: Props) {
	const [linkFormOpem, setLinkFormOpen] = useState(false);
	const [textFormOpem, setTextFormOpen] = useState(false);
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

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
					onClick={() => setLinkFormOpen(true)}
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
					onClick={() => setTextFormOpen(true)}
				>
					Add Text
				</Button>
			</ButtonGroup>
			<Dialog
				open={linkFormOpem}
				onClose={() => setLinkFormOpen(false)}
			>
				<DialogTitle>
					Create Link
					<IconButton
						sx={{ float: 'right' }}
						onClick={() => setLinkFormOpen(false)}
					>
						<CloseIcon/>
					</IconButton>
				</DialogTitle>
				<DialogContent sx={{ textAlign: 'right' }}>
					<LinkForm
						focus
						onAdd={(label, value) => {
							onAddContent({
								label,
								value,
								type: 'link',
							});
							setLinkFormOpen(false);
						}}
					/>
				</DialogContent>
			</Dialog>
			<Dialog
				fullWidth
				open={textFormOpem}
				fullScreen={fullScreen}
				onClose={() => setTextFormOpen(false)}
			>
				<DialogTitle>
					Create Text Content
					<IconButton
						sx={{ float: 'right' }}
						onClick={() => setTextFormOpen(false)}
					>
						<CloseIcon/>
					</IconButton>
				</DialogTitle>
				<DialogContent>
					<TextContentForm
						onAdd={(label, value) => {
							onAddContent({
								label,
								value,
								type: 'text',
							});
							setTextFormOpen(false);
						}}
					/>
				</DialogContent>
			</Dialog>
		</>
	);
}

interface TextContentFormProps {
	onAdd(label: string, content: string): void;
}

function TextContentForm(props: TextContentFormProps) {
	const { onAdd } = props;
	const [label, setLabel] = useState('');
	const [value, setValue] = useState('');
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
		onAdd(label, value);
		setLabel('');
		setValue('');
	}
}
