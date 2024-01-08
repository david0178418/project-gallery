'use client';

import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { Paths } from '@common/constants';
import { User } from 'next-auth';
import { Logout } from '@mui/icons-material';
import {
	BlogIcon,
	HomeIcon,
	LoginIcon,
	MenuIcon,
	RegisterIcon,
} from '@components/icons';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

interface Props {
	user?: User | null;
}

export default
function TopBarDrawer(props: Props) {
	const { user } = props;
	const [open, setOpen] = useState(false);

	return (
		<>
			<IconButton onClick={() => setOpen(true)}>
				<MenuIcon />
			</IconButton>
			<Drawer
				anchor="left"
				open={open}
				onClose={() => setOpen(false)}
				sx={{ width: 250 }}
			>
				<Box sx={{ width: 250 }}>
					<List>
						<ListItem disablePadding>
							<Link href="https://projectgallery.me/project/63a490bfacb4e70acc9931bb/journals">
								<ListItemButton sx={{ width: 250 }}>
									<ListItemIcon>
										<BlogIcon />
									</ListItemIcon>
									<ListItemText>
										Blog
									</ListItemText>
								</ListItemButton>
							</Link>
						</ListItem>
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
					</List>
				</Box>
			</Drawer>
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
		<ListItem disablePadding>
			<Link href={href}>
				<ListItemButton sx={{ width: 250 }}>
					<ListItemIcon>
						{icon}
					</ListItemIcon>
					<ListItemText>
						{children}
					</ListItemText>
				</ListItemButton>
			</Link>
		</ListItem>
	);
}
