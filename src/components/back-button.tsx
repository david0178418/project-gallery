'use client';

import { Paths } from '@common/constants';
import { useRouteBackDefault } from '@common/hooks';
import { BackIcon } from './icons';
import { Button } from './ui/button';

interface Props {
	defaultHref?: string;
}

export default
function BackButton(props: Props) {
	const { defaultHref = Paths.Home } = props;

	const routeBack = useRouteBackDefault(defaultHref);

	return (
		<Button color="primary" onClick={routeBack}>
			<BackIcon />
		</Button>
	);
}
