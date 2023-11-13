'use client';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Props {
	label: string;
	path: string;
	ActiveIcon: any;
	InactiveIcon: any;
}

export default
function LeftRailItem(props: Props) {
	const {
		label,
		path,
		ActiveIcon,
		InactiveIcon,
	} = props;
	const pathname = useSelectedLayoutSegment();
	const Icon = path === `/${pathname}` ?
		ActiveIcon :
		InactiveIcon;

	return (
		<li className="flex">
			<Link
				prefetch={false}
				href={path}
				className={cn(
					'flex',
					'items-center',
					'p-2',
					'text-base',
					'font-medium',
					'items-center',
					'p-2',
					'text-base',
					'font-medium',
					'text-gray-900',
					'rounded-lg',
					'dark:text-white',
					'hover:bg-gray-100',
					'dark:hover:bg-gray-700',
					'group',
					'text-gray-900',
					'rounded-lg',
					'dark:text-white',
					'hover:bg-gray-100',
					'dark:hover:bg-gray-700',
					'group',
				)}
			>
				<Icon className="w-5 h-5" />
				<span className="ml-3">
					{label}
				</span>
			</Link>
		</li>
	);
}
