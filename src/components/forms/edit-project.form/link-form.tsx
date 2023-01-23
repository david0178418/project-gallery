import { TextFieldLengthValidation } from '@components/common/text-field-length-validation';
import { inRange } from '@common/utils';
import { useState } from 'react';
import { UiProject } from '@common/types/Project';
import { MinLinkLabelSize, MaxLinkLabelSize } from '@common/constants';
import {
	Button,
	Grid,
} from '@mui/material';

type ProjectLink = UiProject['links'][number];

export
function linkIsValid(link: ProjectLink) {
	return inRange(link.label.length, MinLinkLabelSize, MaxLinkLabelSize);
}

interface Props {
	onAdd(label: string, url: string): void;
}

export default
function LinkForm(props: Props) {
	const [label, setLabel] = useState('');
	const [url, setUrl] = useState('');
	const { onAdd } = props;

	return (
		<>
			<Grid container columnGap={1}>
				<Grid item>
					<TextFieldLengthValidation
						fullWidth
						margin="dense"
						label="Label"
						value={label}
						onChange={e => setLabel(e.target.value)}
					/>
				</Grid>
				<Grid item>
					<TextFieldLengthValidation
						fullWidth
						margin="dense"
						label="Url"
						value={url}
						onChange={e => setUrl(e.target.value)}
					/>
				</Grid>
			</Grid>
			<Button
				disabled={!linkIsValid({
					label,
					url,
				})}
				onClick={() => onAdd(label, url)}
			>
				Add Link
			</Button>
		</>
	);
}
