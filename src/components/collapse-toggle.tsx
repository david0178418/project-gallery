'use client';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import { ReactNode, useState } from 'react';

interface Props {
	children: ReactNode;
}

export default
function CollapseToggle(props: Props) {
	const { children } = props;
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Collapse in={isOpen}>
				{children}
			</Collapse>
			<Button fullWidth onClick={() => setIsOpen(!isOpen)}>
				{
					isOpen ?
						'Less' :
						'More'
				}
			</Button>
		</>
	);
}
