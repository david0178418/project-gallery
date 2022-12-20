import { AppName, SpecialCharacterCodes } from '@common/constants';
import { useRouteBackDefault } from '@common/hooks';
import { ScrollContent } from '@components/scroll-content';
import { BackIcon } from '@components/icons';
import Head from 'next/head';
import PorjectCard from '@components/project-card';
import {
	Box,
	Grid,
	IconButton,
	Typography,
} from '@mui/material';

export default
function UserProjects() {
	const routeBack = useRouteBackDefault();

	return (
		<>
			<Head>
				<title>{AppName}</title>
			</Head>
			<ScrollContent
				header={
					<Box sx={{
						paddingTop: 1,
						paddingBottom: 2,
					}}>
						<Typography variant="h5" component="div" gutterBottom>
							{/** TODO Capture direct links and send them to home page */}
							<IconButton color="primary" onClick={routeBack}>
								<BackIcon />
							</IconButton>{SpecialCharacterCodes.NBSP}
							Projects
						</Typography>
					</Box>
				}
			>
				<Box padding={1}>
					<Grid container spacing={1} >
						<Grid item xs={12} md={6}>
							<PorjectCard />
						</Grid>
						<Grid item xs={12} md={6}>
							<PorjectCard />
						</Grid>
						<Grid item xs={12} md={6}>
							<PorjectCard />
						</Grid>
						<Grid item xs={12} md={6}>
							<PorjectCard />
						</Grid>
						<Grid item xs={12} md={6}>
							<PorjectCard />
						</Grid>
						<Grid item xs={12} md={6}>
							<PorjectCard />
						</Grid>
						<Grid item xs={12} md={6}>
							<PorjectCard />
						</Grid>
						<Grid item xs={12} md={6}>
							<PorjectCard />
						</Grid>
						<Grid item xs={12} md={6}>
							<PorjectCard />
						</Grid>
						<Grid item xs={12} md={6}>
							<PorjectCard />
						</Grid>
						<Grid item xs={12} md={6}>
							<PorjectCard />
						</Grid>
						<Grid item xs={12} md={6}>
							<PorjectCard />
						</Grid>
						<Grid item xs={12} md={6}>
							<PorjectCard />
						</Grid>
						<Grid item xs={12} md={6}>
							<PorjectCard />
						</Grid>
					</Grid>
				</Box>
			</ScrollContent>
		</>
	);
}
