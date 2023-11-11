import type { ReactNode } from 'react';

interface Props {
	label: string;
	secondary?: string;
	children: ReactNode;
}

export
function RailButtonContent(props: Props) {
	const {
		label,
		secondary = '',
		children,
	} = props;
	return (
		<li className="flex justify-between gap-x-6 py-5">
			<div className="flex min-w-0 gap-x-4">
				{children}
				{label}
				{secondary}
			</div>
		</li>
	);
}
