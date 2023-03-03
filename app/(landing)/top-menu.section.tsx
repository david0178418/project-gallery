'use client';

import { LogoSmall } from '@common/images';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
	BlogIcon,
	LoginIcon,
	MenuIcon,
	RegisterIcon,
} from '@components/icons';
import {
	AppBar,
	Box,
	Button,
	Container,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Toolbar,
	Typography,
} from '@mui/material';
import { ModalActions, Paths } from '@common/constants';
import { UrlObject } from 'url';

const LoginHref = {
	pathname: Paths.Home,
	query: { a: ModalActions.LoginRegister },
} satisfies UrlObject;

export default
function TopMenuSection() {
	return (
		<AppBar
			position="fixed"
			elevation={0}
			sx={{
				backdropFilter: 'blur(8px)',
				backgroundColor: 'rgba(255,255,255,0.8)',
				boxShadow: 'inset 0px -1px 1px #ddd',
			}}
		>
			<Container>
				<Toolbar disableGutters>
					<Box
						width="100%"
						display="flex"
					>
						<Link href={LoginHref}>
							<Box
								display="flex"
								gap={1}
							>
								<Image
									alt=""
									src={LogoSmall}
								/>
								<Typography
									fontSize={20}
									fontWeight="bold"
									sx={{
										display: {
											xs: 'none',
											sm: 'inline',
										},
									}}
								>
									ProjectGallery.me
								</Typography>
							</Box>
						</Link>
					</Box>
					<Box
						sx={{
							display: {
								xs: 'none',
								sm: 'flex',
							},
						}}
					>
						<Link href="https://projectgallery.me/project/63a490bfacb4e70acc9931bb/journals">
							<Button sx={{ marginRight: 1 }}>
								Blog
							</Button>
						</Link>
						<Link href={LoginHref}>
							<Button
								variant="outlined"
								sx={{ marginRight: 1 }}
							>
								Login
							</Button>
						</Link>
						<Link href={LoginHref}>
							<Button
								variant="contained"
							>
								Register
							</Button>
						</Link>
					</Box>
					<Box
						sx={{
							display: {
								xs: 'block',
								sm: 'none',
							},
						}}
					>
						<Menu />
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
}

function Menu() {
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
			>
				<Box width={250}>
					<List>
						<ListItem disablePadding>
							<Link href="https://projectgallery.me/project/63a490bfacb4e70acc9931bb/journals">
								<ListItemButton>
									<ListItemIcon>
										<BlogIcon />
									</ListItemIcon>
									<ListItemText>
										Blog
									</ListItemText>
								</ListItemButton>
							</Link>
						</ListItem>
						<ListItem disablePadding>
							<ListItemButton>
								<ListItemIcon>
									<RegisterIcon />
								</ListItemIcon>
								<ListItemText>
									Register
								</ListItemText>
							</ListItemButton>
						</ListItem>
						<ListItem disablePadding>
							<ListItemButton>
								<ListItemIcon>
									<LoginIcon />
								</ListItemIcon>
								<ListItemText>
									Login
								</ListItemText>
							</ListItemButton>
						</ListItem>
					</List>
				</Box>
			</Drawer>
		</>
	);
}
