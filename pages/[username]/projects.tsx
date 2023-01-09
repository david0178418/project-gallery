import Head from 'next/head';
import ProjectCard from '@components/project-card';
import { useRouteBackDefault } from '@common/hooks';
import { ScrollContent } from '@components/scroll-content';
import { BackIcon } from '@components/icons';
import { GetServerSideProps } from 'next';
import { UsernameValidation } from '@common/types/UserCredentials';
import { UiProject } from '@common/types/Project';
import { getServerSession } from '@server/auth-options';
import { dbProjectToUiProject } from '@server/transforms';
import { AppName, SpecialCharacterCodes } from '@common/constants';
import { fetchUser, fetchUserGallery } from '@server/queries';
import {
	Box,
	Container,
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
				journals: [],
			},
		};
	}

	const pageUser = await fetchUser(result.data);
	const username = pageUser?.username;

	if(!username) {
		return {
			props: {
				session,
				username: 'unknown',
				unknownUser: true,
				projects: [],
				journals: [],
			},
		};
	}

	const projects = (await fetchUserGallery(username)).map(dbProjectToUiProject);

	return {
		props: {
			session,
			username,
			projects,
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
							{username}{SpecialCharacterCodes.RSQUO}s Projects
						</Typography>
					</Box>
				}
			>
				<Container>
					<Typography variant="h6">
						Projects
					</Typography>
					<Grid padding={1} container spacing={1} >
						{projects.map(p => (
							<Grid
								key={p._id}
								item
								xs={12}
								md={6}
							>
								<ProjectCard
									project={p}
								/>
							</Grid>
						))}
					</Grid>
				</Container>
			</ScrollContent>
		</>
	);
}
