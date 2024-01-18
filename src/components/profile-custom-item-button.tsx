'use client';
import { ReactNode, useState } from 'react';
import { CustomTextItemIcon } from './icons';
import CollpaseAreaToggle from './collapse-area-toggle';

interface Props {
	label: string;
	children: ReactNode;
}

export default
function ProfileCustomTextItem(props: Props) {
	const {
		children,
		label,
	} = props;
	const [isOpen, setIsOpen] = useState(false);
	return (
		<CollpaseAreaToggle
			label={label}
			show={isOpen}
			active={isOpen}
			icon={CustomTextItemIcon}
			collapseSx={{ marginLeft: 0 }}
			onButtonClick={() => setIsOpen(!isOpen)}
		>
			{children}
		</CollpaseAreaToggle>
	);
}
