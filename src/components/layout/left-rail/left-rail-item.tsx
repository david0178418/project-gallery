'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RailButtonContent } from './rail-button-content';
import {
	ListItem,
	ListItemButton,
} from '@ui';

interface Props {
	label: string;
	path: string;
	ActiveIcon: any;
	InactiveIcon: any;
}

export
async function LeftRailItem(props: Props) {
	const {
		label,
		path,
		ActiveIcon,
		InactiveIcon,
	} = props;
	const pathname = usePathname();

	return (
		<ListItem disablePadding>
			<Link
				shallow
				passHref
				legacyBehavior
				href={path}
			>
				<ListItemButton>
					<RailButtonContent label={label}>
						{
							path === pathname ?
								<ActiveIcon /> :
								<InactiveIcon />
						}
					</RailButtonContent>
				</ListItemButton>
			</Link>
		</ListItem>
	);
}
