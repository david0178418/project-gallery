'use client';

import { default as Grid } from '@mui/material/Unstable_Grid2/Grid2';
import Image from 'next/image';
import { ReactNode } from 'react';
import Img1 from './img1.png';
import Img2 from './img2.png';
import Img3 from './img3.png';
import {
	Box,
	Button,
	Paper,
	Typography,
} from '@mui/material';
import Link from 'next/link';
import { ModalActions, Paths } from '@common/constants';

export default
function Features() {
	return (
		<>
			<Grid
				container
				marginTop={10}
				direction={{
					xs: 'column-reverse',
					md: 'row',
				}}
				sx={{ backgroundColor: '#5271ff11' }}
			>
				<Grid
					xs={12}
					md={7}
					padding={3}
					textAlign={{
						xs: 'center',
						md: 'right',
					}}
				>
					<ImageWrapper>
						<Image
							alt=""
							src={Img1}
							style={{
								position: 'revert',
								objectFit: 'contain',
								height: 'revert',
								width: '100%',
								maxHeight: '100%',
								maxWidth: 600,
							}}
						/>
					</ImageWrapper>
				</Grid>
				<Grid
					xs={12}
					md={4}
					padding={5}
					paddingBottom={{
						xs: 0,
						md: 5,
					}}
					textAlign={{
						xs: 'center',
						md: 'unset',
					}}
				>
					<Typography variant="h4" gutterBottom>
						Let Your Work Speak for Itself
					</Typography>
					<Typography>
						No more struggling with how to present your projects - simply enter your work and let it do the talking.
						Our platform puts the spotlight on your talent and creativity, allowing you to showcase your skills with ease.
					</Typography>
				</Grid>
			</Grid>

			<Grid
				container
				marginTop={5}
			>
				<Grid
					mdOffset={1}
					xs={12}
					md={4}
					padding={5}
					paddingTop={{
						xs: 0,
						md: 5,
					}}
					textAlign={{
						xs: 'center',
						md: 'right',
					}}
				>
					<Typography variant="h4" gutterBottom>
						Document Your Journey
					</Typography>
					<Typography>
						What challeges did you have to overcome?
						How did you balance the choices you had when you made your decisions?
						Capture and share these unique expriences in a project journal.
					</Typography>
				</Grid>
				<Grid
					xs={12}
					md={5}
					padding={3}
					paddingTop={{
						xs: 0,
						md: 5,
					}}
				>
					<ImageWrapper>
						<Image
							alt=""
							src={Img2}
							style={{
								position: 'revert',
								objectFit: 'contain',
								height: 'revert',
								width: '100%',
								maxHeight: '100%',
								maxWidth: 600,
							}}
						/>
					</ImageWrapper>
				</Grid>
			</Grid>

			<Grid
				container
				marginTop={5}
				direction={{
					xs: 'column-reverse',
					md: 'row',
				}}
				sx={{ backgroundColor: '#5271ff11' }}
			>
				<Grid
					xs={12}
					md={7}
					padding={3}
					textAlign={{
						xs: 'center',
						md: 'right',
					}}
				>
					<ImageWrapper>
						<Image
							alt=""
							src={Img3}
							style={{
								position: 'revert',
								objectFit: 'contain',
								height: 'revert',
								width: '100%',
								maxHeight: '100%',
								maxWidth: 600,
							}}
						/>
					</ImageWrapper>
				</Grid>
				<Grid
					xs={12}
					md={4}
					padding={5}
					paddingBottom={{
						xs: 0,
						md: 5,
					}}
					textAlign={{
						xs: 'center',
						md: 'unset',
					}}
				>
					<Typography variant="h4" gutterBottom>
						Links and Categories
					</Typography>
					<Typography>
						Add at-a-glance context to your project with custom category labels.
						And take it a step further by linking off-site for the project itself or any other information that others would find interesting.
					</Typography>
				</Grid>
			</Grid>

			<Box marginTop={15} marginBottom={30} textAlign="center">
				<Link href={{
					pathname: Paths.Home,
					query: { a: ModalActions.LoginRegister },
				}}>
					<Button
						variant="contained"
						sx={{
							borderRadius: 5,
							fontSize: 30,
						}}
					>
						Create your free project gallery
					</Button>
				</Link>
			</Box>
		</>
	);
}

interface ImageWrapperProps {
	children: ReactNode;
}

function ImageWrapper(props: ImageWrapperProps) {
	const { children } = props;
	return (
		<Paper elevation={5} sx={{
			padding: 2,
			display: 'inline-block',
		}}>
			{children}
		</Paper>
	);
}
