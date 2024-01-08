'use client';
import { CancelIcon } from '@components/icons';
import { ComponentProps } from 'react';
import { ConfirmIcon } from '@components/icons';
import MuiButton from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import { useRouteBackDefault } from '@common/hooks';

// TODO Reorganize common buttons

interface Props extends ComponentProps<typeof MuiButton> {
	label?: string;
	fallbackUrl?: string;
}

export
function CancelButton(props: Props) {
	const {
		children,
		label,
		fallbackUrl,
	} = props;
	const fullScreen = useFullscreen();
	const routeBack = useRouteBackDefault(fallbackUrl);
	const renderedLabel = label || children || 'Cancel';

	return (
		<MuiButton
			color="error"
			variant="outlined"
			fullWidth={fullScreen}
			endIcon={<CancelIcon />}
			onClick={routeBack}
			{...props}
		>
			{renderedLabel}
		</MuiButton>
	);
}

export
function ConfirmButton(props: Props) {
	const {
		children,
		label,
	} = props;
	const fullScreen = useFullscreen();
	const renderedLabel = label || children || 'Confirm';

	return (
		<MuiButton
			color="success"
			variant="outlined"
			fullWidth={fullScreen}
			endIcon={<ConfirmIcon />}
			{...props}
		>
			{renderedLabel}
		</MuiButton>
	);
}

function useFullscreen() {
	const theme = useTheme();
	return useMediaQuery(theme.breakpoints.down('sm'));
}
