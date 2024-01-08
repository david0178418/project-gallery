import Image from 'next/image';
import MainImage from './homepage-main-image.png';
import { CheckCircleIcon } from '@components/icons';
import Link from 'next/link';
import { Paths, SpecialCharacterCodes } from '@common/constants';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

export default
function Hero() {
	return (
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
					marginTop={4}
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
									<strong>Focus</strong> on your work, not how to present it
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
				</Grid>
			</Box>
			<Box
				textAlign="center"
				marginTop={4}
				display="flex"
				flexDirection="column"
				gap={3}
			>
				<Link href={Paths.UserRegister}>
					<Button
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
						Create Your{SpecialCharacterCodes.NBSP}<strong>Free</strong>{SpecialCharacterCodes.NBSP}Gallery
					</Button>
				</Link>
				<Link href={Paths.Home}>
					<Button
						variant="outlined"
						size="large"
						sx={{
							borderRadius: 5,
							width: {
								xs: 1,
								sm: 'unset',
							},
						}}
					>
						Explore Project Gallery
					</Button>
				</Link>
			</Box>
			<Box
				textAlign="center"
				marginTop={6}
				sx={{ marginRight: { sm: 10 } }}
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
	);
}
