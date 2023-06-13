'use client';

import { Paths } from '@common/constants';
import { useRouteBackDefault } from '@common/hooks';
import { IconButton } from '@ui';
import { BackIcon } from './icons';

interface Props {
	defaultHref?: string;
}

export default
function BackButton(props: Props) {
	const { defaultHref = Paths.Home } = props;

	const routeBack = useRouteBackDefault(defaultHref);

	return (
		<IconButton color="primary" onClick={routeBack}>
			<BackIcon />
		</IconButton>
	);
}
