'use client';

import { LogoSmall } from '@common/images';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import MainImage from './homepage-main-image.png';
import {
	CheckCircleIcon,
	LoginIcon,
	MenuIcon,
} from '@components/icons';
import {
	AppBar,
	Box,
	Button,
	Container,
	Drawer,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Toolbar,
	Typography,
} from '@mui/material';

export default
function LandingPage() {
	return (
		<>
			<TopMenu />
			<Container>
				<Box
					textAlign="center"
					marginTop={15}
				>
					<Typography
						variant="h1"
						fontWeight="bold"
						fontSize={50}
					>
						<Box color="primary.main">
							Your Project<br />
						</Box>
						Your Story
					</Typography>
					<Grid
						container
						direction="row"
						justifyContent="center"
						paddingTop={4}
					>
						<Grid
							item
							xs={12}
							sm={6}
							lg={4}
						>
							<List dense>
								{[
									<>
										<strong>Create</strong> your own personal project portfolio
									</>,
									<>
										<strong>Focus</strong> on your work. Not how to present it.
									</>,
									<>
										<strong>Document</strong> your progress  with a project journal
									</>,
									<>
										<strong>Share</strong> your experience with the world
									</>,
									<>
										<strong>Discover</strong> the work of other builders
									</>,
								].map((t, i) => (
									<ListItem key={i}>
										<ListItemIcon
											sx={{
												minWidth: {
													xs: 'unset',
													md: 56,
												},
												paddingRight: 1,
												justifyContent: 'right',
											}}
										>
											<CheckCircleIcon color="primary" />
										</ListItemIcon>
										<ListItemText>
											{t}
										</ListItemText>
									</ListItem>
								))}
							</List>
						</Grid>
						<Grid>

						</Grid>
					</Grid>
				</Box>
				<Box
					textAlign="center" paddingTop={4}
				>
					<Button
						color="primary"
						variant="contained"
						size="large"
						sx={{
							borderRadius: 5,
							width: {
								xs: 1,
								sm: 'unset',
							},
						}}
					>
						Create Your Gallery Now
					</Button>
				</Box>
				<Box
					textAlign="center"
					paddingTop={6}
					marginRight={10}
				>
					<Image
						alt=""
						priority
						src={MainImage}
						style={{
							position: 'revert',
							objectFit: 'contain',
							height: 'revert',
							width: '100%',
							maxHeight: '100%',
							maxWidth: 900,
						}}
					/>
				</Box>
			</Container>
		</>
	);
}
function TopMenu() {
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
						<Link href="/" >
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
						<Link href="/">
							<Button
								variant="outlined"
								sx={{ marginRight: 1 }}
							>
								Login
							</Button>
						</Link>
						<Link href="/">
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
							<ListItemButton>
								<ListItemIcon>
									<LoginIcon />
								</ListItemIcon>
								<ListItemText>
									Login
								</ListItemText>
							</ListItemButton>
						</ListItem>
						<ListItem disablePadding>
							<ListItemButton>
								<ListItemIcon>
									<LoginIcon />
								</ListItemIcon>
								<ListItemText>
									Register
								</ListItemText>
							</ListItemButton>
						</ListItem>
					</List>
				</Box>
			</Drawer>
		</>
	);
}
