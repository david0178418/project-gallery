import { TextFieldLengthValidation } from '@components/common/text-field-length-validation';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import { UiProject } from '@common/types/Project';
import { inRange } from '@common/utils';
import {
	MaxLabelSize,
	MinLabelSize,
} from '@common/constants';

type ProjectLabel = UiProject['labels'][number];

interface Props {
	onAdd(label: string): void;
}

export default
function LabelForm(props: Props) {
	const [label, setLabel] = useState('');
	const { onAdd } = props;

	return (
		<>
			<Grid container columnGap={1}>
				<Grid>
					<TextFieldLengthValidation
						fullWidth
						margin="dense"
						label="Label"
						value={label}
						onChange={e => setLabel(e.target.value)}
					/>
				</Grid>
			</Grid>
			<Button
				disabled={!labelIsValid({ label })}
				onClick={() => onAdd(label)}
			>
				Add Label
			</Button>
		</>
	);
}

export
function labelIsValid(label: ProjectLabel) {
	return inRange(label.label.length, MinLabelSize, MaxLabelSize);
}
