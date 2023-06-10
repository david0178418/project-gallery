import { LogoSmall } from '@common/images';
import Image from 'next/image';
import Link from 'next/link';
import { Paths } from '@common/constants';
import TopBarDrawer from './page.top-bar.drawer';
import { getServerSession } from '@server/auth-options';
import {
	AppBar,
	Box,
	Button,
	Container,
	Toolbar,
	Typography,
} from '@ui';

export default
async function TopBar() {
	const session = await getServerSession();
	const user = session?.user || null;
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
						<Link href="/">
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
						{!user && (
							<>
								<Link href={Paths.ModalLoginEmail}>
									<Button
										variant="outlined"
										sx={{ marginRight: 1 }}
									>
										Login
									</Button>
								</Link>
								<Link href={Paths.ModalRegister}>
									<Button variant="contained">
										Register
									</Button>
								</Link>
							</>
						)}
						{user && (
							<>
								<Link href={'???'}>
									<Button
										variant="outlined"
										sx={{ marginRight: 1 }}
									>
										Logout
									</Button>
								</Link>
								<Link href={Paths.Home}>
									<Button variant="contained">
										{user.username}
									</Button>
								</Link>
							</>
						)}
					</Box>
					<Box
						sx={{
							display: {
								xs: 'block',
								sm: 'none',
							},
						}}
					>
						<TopBarDrawer user={user}/>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
}
