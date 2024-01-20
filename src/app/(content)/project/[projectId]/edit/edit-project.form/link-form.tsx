'use client';
import { TextFieldLengthValidation } from '@components/common/text-field-length-validation';
import { useState } from 'react';
import { CustomLinkValidator } from '@common/types/CustomLink';
import { Key } from 'ts-key-enum';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

interface Props {
	focus?: boolean;
	label: string;
	value: string;
	onAdd(label: string, url: string): void;
}

export default
function LinkForm(props: Props) {
	const {
		focus,
		label: rawLabel,
		value: rawValue,
		onAdd,
	} = props;
	const [label, setLabel] = useState(rawLabel);
	const [value, setValue] = useState(rawValue);
	const validationResult = CustomLinkValidator.safeParse({
		value,
		label,
		type: 'link',
	});

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

	return (
		<>
			<Grid container columnGap={1} paddingBottom={2}>
				<Grid item>
					<TextFieldLengthValidation
						fullWidth
						margin="dense"
						label="Label"
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
						value={value}
						onKeyUp={e => handleKeyUp(e.key)}
						onChange={e => setValue(e.target.value)}
					/>
				</Grid>
			</Grid>
			<Button
				variant="contained"
				disabled={!validationResult.success}
				onClick={handleAdd}
			>
				Save
			</Button>
		</>
	);
}
