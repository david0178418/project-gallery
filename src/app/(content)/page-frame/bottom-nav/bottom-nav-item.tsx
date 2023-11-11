'use client';
import { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useSelectedLayoutSegment } from 'next/navigation';

type Props = {
	label: string;
	href: string;
} & ({
	activeIcon: ReactNode;
	inactiveIcon: ReactNode;
} | {
	icon: ReactNode;
});

export default
function BottomNavItem(props: Props) {
	const {
		label,
		href,
	} = props;
	const pathname = useSelectedLayoutSegment();

	return (
		<Link
			href={href}
			className={cn(

				'inline-flex',
				'flex-col',
				'items-center',
				'justify-center',
				'px-5',
				'hover:bg-gray-50',
				'dark:hover:bg-gray-800',
				'group',
			)}
		>
			{'icon' in props && props.icon}
			{!('icon' in props) && (
				href === `/${pathname}` ?
					props.activeIcon :
					props.inactiveIcon
			)}
			<span className={cn(
				'text-sm',
				'text-gray-500',
				'dark:text-gray-400',
				'group-hover:text-blue-600',
				'dark:group-hover:text-blue-500',
			)}>
				{label}
			</span>
		</Link>
	);
}
