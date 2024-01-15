'use client';
import { TextFieldLengthValidation } from '@components/common/text-field-length-validation';
import { useState } from 'react';
import { CustomLinkValidator } from '@common/types/CustomLink';
import { Key } from 'ts-key-enum';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

interface Props {
	focus?: boolean;
	onAdd(label: string, url: string): void;
}

export default
function LinkForm(props: Props) {
	const {
		focus,
		onAdd,
	} = props;
	const [label, setLabel] = useState('');
	const [url, setUrl] = useState('');
	const validationResult = CustomLinkValidator.safeParse({
		url,
		label,
	});

	function handleKeyUp(key: string) {
		if(key === Key.Enter && validationResult.success) {
			handleAdd();
		}
	}

	function handleAdd() {
		onAdd(label, url);
		setLabel('');
		setUrl('');
	}

	return (
		<>
			<Grid container columnGap={1} paddingBottom={2}>
				<Grid item>
					<TextFieldLengthValidation
						fullWidth
						margin="dense"
						label="Label"
						onFocus={() => console.log('asdfasdfsd')}
						autoFocus={focus}
						value={label}
						onKeyUp={e => handleKeyUp(e.key)}
						onChange={e => setLabel(e.target.value)}
					/>
				</Grid>
				<Grid item>
					<TextFieldLengthValidation
						fullWidth
						margin="dense"
						label="Url"
						value={url}
						onKeyUp={e => handleKeyUp(e.key)}
						onChange={e => setUrl(e.target.value)}
					/>
				</Grid>
			</Grid>
			<Button
				variant="contained"
				disabled={!validationResult.success}
				onClick={handleAdd}
			>
				Add Link
			</Button>
		</>
	);
}
