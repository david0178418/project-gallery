import Head from 'next/head';
import ProjectCard from '@components/project-card';
import { AppName, SpecialCharacterCodes } from '@common/constants';
import { useRouteBackDefault } from '@common/hooks';
import { ScrollContent } from '@components/scroll-content';
import { BackIcon } from '@components/icons';
import { GetServerSideProps } from 'next';
import { UsernameValidation } from '@common/types/UserCredentials';
import { UiProject } from '@common/types/Project';
import { getServerSession } from '@server/auth-options';
import { fetchUserGallery } from '@server/queries';
import { dbProjectToUiProject } from '@server/transforms';
import {
	Box,
	Grid,
	IconButton,
	Typography,
} from '@mui/material';

interface Props {
	unknownUser?: boolean;
	username: string;
	projects: UiProject[];
}

export
const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
	const result = await UsernameValidation.safeParseAsync(ctx.query.username);
	const session = await getServerSession(ctx.req, ctx.res);

	if(!result.success) {
		return {
			props: {
				session,
				username: 'unknown',
				unknownUser: true,
				projects: [],
			},
		};
	}

	const username = result.data;
	const dbProjects = await fetchUserGallery(username) || [];

	return {
		props: {
			session,
			username,
			projects: dbProjects.map(dbProjectToUiProject),
		},
	};
};

export default
function UserGallery(props: Props) {
	const routeBack = useRouteBackDefault();
	const {
		username,
		projects,
	} = props;

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
							{username}{SpecialCharacterCodes.RSQUO}s Gallery
						</Typography>
					</Box>
				}
			>
				<Grid padding={1} container spacing={1} >
					{projects.map(p => (
						<Grid
							key={p._id}
							item
							xs={12}
							md={6}
						>
							<ProjectCard
								key={p._id}
								project={p}
							/>
						</Grid>
					))}
				</Grid>
			</ScrollContent>
		</>
	);
}
