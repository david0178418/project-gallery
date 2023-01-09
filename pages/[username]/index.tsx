import Head from 'next/head';
import ProjectCard from '@components/project-card';
import {
	AppName, Paths, SpecialCharacterCodes,
} from '@common/constants';
import { useRouteBackDefault } from '@common/hooks';
import { ScrollContent } from '@components/scroll-content';
import { BackIcon } from '@components/icons';
import { GetServerSideProps } from 'next';
import { UsernameValidation } from '@common/types/UserCredentials';
import { UiProject } from '@common/types/Project';
import { getServerSession } from '@server/auth-options';
import JournalsList from '@components/journals-list';
import { UiJournal } from '@common/types/Journal';
import { dbJournalToUiJournal, dbProjectToUiProject } from '@server/transforms';
import Link from 'next/link';
import {
	fetchUser,
	fetchUserGallery,
	fetchUserJournals,
} from '@server/queries';
import {
	Box,
	Container,
	Grid,
	IconButton,
	Link as MuiLink,
	Typography,
} from '@mui/material';

interface Props {
	unknownUser?: boolean;
	username: string;
	projects: UiProject[];
	journals: UiJournal[];
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

	const isOwner = !!username && (username === session?.user.username);
	const projects = (await fetchUserGallery(username)).map(dbProjectToUiProject);
	const journals = (await fetchUserJournals(username, isOwner)).map(dbJournalToUiJournal);

	return {
		props: {
			session,
			username,
			projects,
			journals,
		},
	};
};

export default
function UserGallery(props: Props) {
	const routeBack = useRouteBackDefault();
	const {
		username,
		projects,
		journals,
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
				<Container>
					<Typography variant="h6">
						<Link href={Paths.UserProjects(username)} passHref legacyBehavior>
							<MuiLink>
								Projects
							</MuiLink>
						</Link>
					</Typography>
					<Grid padding={1} container spacing={1} >
						{projects.slice(0, 2).map(p => (
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
					<Typography variant="h6">
						<Link href={Paths.UserJournals(username)} passHref legacyBehavior>
							<MuiLink>
								Journal Posts
							</MuiLink>
						</Link>
					</Typography>
					<JournalsList journals={journals} />
				</Container>
			</ScrollContent>
		</>
	);
}
