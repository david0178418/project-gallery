'use client';
import { CancelIcon } from '@components/icons';
import { ComponentProps, type ReactNode } from 'react';
import { ConfirmIcon } from '@components/icons';
import { useRouteBackDefault } from '@common/hooks';
import { Button as ShadButton } from '@/components/ui/button';

// TODO Reorganize common buttons

interface Props extends ComponentProps<typeof ShadButton> {
	label?: string;
	fallbackUrl?: string;
	icon?: ReactNode;
	children?: ReactNode;
}

export
function CancelButton(props: Props) {
	const {
		children,
		label,
		fallbackUrl,
		icon = <CancelIcon className="mr-2 h-4 w-4" />,
	} = props;
	const routeBack = useRouteBackDefault(fallbackUrl);
	const renderedLabel = label || children || 'Cancel';

	return (
		<ShadButton
			color="error"
			onClick={routeBack}
			variant="outline"
			className="sm:w-full"
			{...props}
		>
			{icon}
			{renderedLabel}
		</ShadButton>
	);
}

export
function ConfirmButton(props: Props) {
	const {
		children,
		label,
		icon = <ConfirmIcon className="mr-2 h-4 w-4" />,
	} = props;
	const renderedLabel = label || children || 'Confirm';

	return (
		<ShadButton
			color="success"
			variant="outline"
			className="sm:w-full"
			{...props}
		>
			{icon}
			{renderedLabel}
		</ShadButton>
	);
}
