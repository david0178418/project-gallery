import { TextFieldLengthValidation } from '@components/common/text-field-length-validation';
import { inRange } from '@common/utils';
import { useState } from 'react';
import { UiProject } from '@common/types/Project';
import { MinLinkLabelSize, MaxLinkLabelSize } from '@common/constants';
import { Button } from '@components/ui/button';

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
			<div className="gap-1">
				<div>
					<TextFieldLengthValidation
						className="w-full"
						label="Label"
						value={label}
						onChange={e => setLabel(e.target.value)}
					/>
				</div>
				<div>
					<TextFieldLengthValidation
						className="w-full"
						label="Url"
						value={url}
						onChange={e => setUrl(e.target.value)}
					/>
				</div>
			</div>
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
