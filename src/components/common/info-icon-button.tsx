import type { TooltipProps } from '@mui/material/Tooltip';

import { InfoIcon } from '@components/icons';
import { IconButton, Tooltip } from '@ui';
import { forwardRef } from 'react';

interface Props {
	label: string;
	placement?: TooltipProps['placement'];
}

export
const ShareIconButton = forwardRef((props: Props, ref) => {
	const {
		label,
		placement = 'bottom',
	} = props;
	return (
		<Tooltip title={label} placement={placement} ref={ref}>
			<IconButton size="small">
				<InfoIcon fontSize="small" />
			</IconButton>
		</Tooltip>
	);
});
