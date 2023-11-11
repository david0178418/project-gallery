'use client';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

interface Props {
	label: string;
	path: string;
	ActiveIcon: any;
	InactiveIcon: any;
}

export
function LeftRailItem(props: Props) {
	const {
		label,
		path,
		ActiveIcon,
		InactiveIcon,
	} = props;
	const pathname = useSelectedLayoutSegment();

	return (
		<li className="flex justify-between gap-x-6 py-5">
			<div className="flex min-w-0 gap-x-4">
				<Link
					prefetch={false}
					href={path}
				>
					<div>
						{label}
						{
							path === `/${pathname}` ?
								<ActiveIcon /> :
								<InactiveIcon />
						}
					</div>
				</Link>
			</div>
		</li>
	);
}
