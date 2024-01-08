import { LogoSmall } from '@common/images';
import Image from 'next/image';
import Link from 'next/link';
import { Paths } from '@common/constants';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default
async function TopBar() {
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
					<Box display="flex" >
						<Link href="https://projectgallery.me/project/63a490bfacb4e70acc9931bb/journals">
							<Button sx={{
								marginRight: 1,
								display: {
									xs: 'none',
									sm: 'inline',
								},
							}}>
								Blog
							</Button>
						</Link>
						<Link href={Paths.UserRegister}>
							<Button variant="contained">
								Register
							</Button>
						</Link>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
}
