'use client';

import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { Paths } from '@common/constants';
import { User } from 'next-auth';
import { Logout } from '@mui/icons-material';
import { cn } from '@/lib/utils';
import {
	BlogIcon,
	HomeIcon,
	LoginIcon,
	MenuIcon,
	RegisterIcon,
} from '@components/icons';
import { Button } from '@components/ui/button';

interface Props {
	user: User | null;
}

export default
function TopBarDrawer(props: Props) {
	const { user } = props;
	const [open, setOpen] = useState(false);

	return (
		<>
			<Button onClick={() => setOpen(true)}>
				<MenuIcon />
			</Button>
			<div
				className={cn(
					'fixed',
					'top-0',
					'left-0',
					'z-40',
					'h-screen',
					'p-4',
					'overflow-y-auto',
					'transition-transform',
					'bg-white',
					'w-80',
					'dark:bg-gray-800',
					{ '-translate-x-full': !open }
				)}
				// onClose={() => setOpen(false)}
			>
				<div className="w-[250px]">
					<ul>
						<li>
							<Link href="https://projectgallery.me/project/63a490bfacb4e70acc9931bb/journals">
								<div>
									<div>
										<BlogIcon />
									</div>
									<div>
										Blog
									</div>
								</div>
							</Link>
						</li>
						{!user?.username && (
							<>
								<Item
									href={Paths.UserRegister}
									icon={<RegisterIcon/>}
								>
									Register
								</Item>
								<Item
									href={Paths.UserLoginEmail}
									icon={<LoginIcon/>}
								>
									Login
								</Item>
							</>
						)}
						{!!user?.username && (
							<>
								<Item
									href={Paths.Home}
									icon={<HomeIcon/>}
								>
									{user.username}
								</Item>
								<Item
									href={'???'}
									icon={<Logout/>}
								>
									Sign out
								</Item>
							</>
						)}
					</ul>
				</div>
			</div>
		</>
	);
}

interface ItemProps {
	children: ReactNode;
	href: string;
	icon: ReactNode,
}

function Item(props: ItemProps) {
	const {
		children,
		href,
		icon,
	} = props;
	return (
		<ul>
			<Link href={href}>
				<li className="w-[250px]">
					{icon}
					<div>
						{children}
					</div>
				</li>
			</Link>
		</ul>
	);
}
