'use client';

import { LogoInvertedImage } from '@common/images';
import {
	AppBar,
	Box,
	Container,
	Toolbar,
	Typography,
} from '@mui/material';
import Image from 'next/image';

export default
function HomePage() {
	return (
		<>
			<TopMenu />
			<Container>
				<Box textAlign="center">
					<Typography>
						Your Project, Your Story.
					</Typography>
				</Box>
			</Container>
		</>
	);
}
function TopMenu() {
	return (
		<AppBar position="static" elevation={0}>
			<Container maxWidth="xl">
				<Toolbar disableGutters>

					<Box
						component="a"
						sx={{ width: '100%' }}
					>
						<Image
							alt=""
							src={LogoInvertedImage}
						/>
					</Box>
					<Box sx={{
						flexGrow: 1,
						display: {
							xs: 'none',
							md: 'flex',
						},
					}}>
						{' '}
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
}
