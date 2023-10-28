'use client';
import { BottomNavigationAction } from '@ui';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

interface Props {
	label: string;
	href: string;
	activeIcon: any;
	inactiveIcon: any;
}

export default
function BottomNavItem(props: Props) {
	const {
		label,
		href,
		activeIcon,
		inactiveIcon,
	} = props;
	const pathname = useSelectedLayoutSegment();

	return (
		<BottomNavigationAction
			showLabel
			label={label}
			href={href}
			value={href}
			LinkComponent={Link}
			icon={
				href === `/${pathname}` ?
					activeIcon :
					inactiveIcon
			}
		/>
	);
}
