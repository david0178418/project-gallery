import { CancelIcon } from '@components/icons';
import { Button as MuiButton } from '@mui/material';
import { ComponentProps, forwardRef } from 'react';
import { ConfirmIcon } from '@components/icons';

// TODO Reorganize common buttons

interface Props extends ComponentProps<typeof MuiButton> {
	label?: string;
}

export
const CancelButton = forwardRef<HTMLButtonElement, Props>((props: Props, ref) => {
	const {
		children,
		label,
	} = props;
	const renderedLabel = label || children || 'Cancel';

	return (
		<MuiButton
			color="error"
			variant="outlined"
			ref={ref}
			endIcon={<CancelIcon />}
			{...props}
		>
			{renderedLabel}
		</MuiButton>
	);
});

export
const ConfirmButton = forwardRef<HTMLButtonElement, Props>((props: Props, ref) => {
	const {
		children,
		label,
	} = props;
	const renderedLabel = label || children || 'Confirm';

	return (
		<MuiButton
			color="success"
			variant="outlined"
			ref={ref}
			endIcon={<ConfirmIcon />}
			{...props}
		>
			{renderedLabel}
		</MuiButton>
	);
});
