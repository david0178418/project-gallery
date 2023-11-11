import { TextFieldLengthValidation } from '@components/common/text-field-length-validation';
import { useState } from 'react';
import { UiProject } from '@common/types/Project';
import { MaxLabelSize, MinLabelSize } from '@common/constants';
import { inRange } from '@common/utils';
import { Button } from '@/components/ui/button';

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
			<div className="container grid gap-1">
				<div>
					<TextFieldLengthValidation
						className="w-full"
						label="Label"
						value={label}
						onChange={e => setLabel(e.target.value)}
					/>
				</div>
			</div>
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
