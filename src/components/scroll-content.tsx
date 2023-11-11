import type { ReactNode } from 'react';

interface Props {
	header?: ReactNode;
	children: ReactNode;
}

export
function ScrollContent(props: Props) {
	const {
		children,
		header,
	} = props;
	return (
		<div className="flex flex-col max-h-full">
			{header}
			<div className="overflow-x-hidden overflow-y-auto flex-1 pb-24">
				{children}
			</div>
		</div>
	);
}
