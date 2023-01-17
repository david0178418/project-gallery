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
import {
	dbJournalToUiJournal, dbProjectToUiProject, dbUserProfileToUiUserProfile,
} from '@server/transforms';
import Link from 'next/link';
import {
	fetchUser,
	fetchUserGallery,
	fetchUserJournals,
	fetchUserProfileByUsername,
} from '@server/queries';
import {
	Box,
	Container,
	Grid,
	IconButton,
	Tab,
	Tabs,
	Typography,
} from '@mui/material';
import { UiUserProfile } from '@common/types/UserProfile';
import MarkdownContent from '@components/markdown-content';

const TabPaths = {
	projects: {
		label: 'Projects',
		value: 'projects',
		path: (username: string) => Paths.UserGallery(username),
	},
	journals: {
		label: 'Journal Posts',
		value: 'journals',
		path: (useername: string) => Paths.UserGalleryJournals(useername),
	},
	about: {
		label: 'About',
		value: 'about',
		path: (username: string) => Paths.UserGalleryAbout(username),
	},
} as const;

type TabPath = keyof typeof TabPaths;

interface Props {
	unknownUser?: boolean;
	username: string;
	subPath: TabPath ;
	userProfile: UiUserProfile | null;
	projects: UiProject[] | null;
	journals: UiJournal[] | null;
}

export
const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
	const result = await UsernameValidation.safeParseAsync(ctx.query.username);
	const session = await getServerSession(ctx.req, ctx.res);
	const [rawSubPath] = ctx.params?.params || [];
	const subPath = TabPaths[rawSubPath as TabPath]?.value || TabPaths.projects.value;

	if(!result.success) {
		return {
			props: {
				session,
				subPath,
				username: 'unknown',
				unknownUser: true,
				userProfile: null,
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
				subPath,
				username: 'unknown',
				unknownUser: true,
				userProfile: null,
				projects: [],
				journals: [],
			},
		};
	}

	const dbUserProfile = await fetchUserProfileByUsername(username);
	const isOwner = !!username && (username === session?.user.username);
	const projects = (await fetchUserGallery(username)).map(dbProjectToUiProject);
	const journals = (await fetchUserJournals(username, isOwner)).map(dbJournalToUiJournal);

	return {
		props: {
			session,
			subPath,
			username,
			projects,
			journals,
			userProfile: dbUserProfile && dbUserProfileToUiUserProfile(dbUserProfile),
		},
	};
};

export default
function UserGallery(props: Props) {
	const routeBack = useRouteBackDefault();
	const {
		username,
		subPath: selectedTab,
		projects,
		userProfile,
		journals,
	} = props;

	const galleryLabel = `${username}'s Gallery`;

	return (
		<>
			<Head>
				<title>{galleryLabel} - {AppName}</title>
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
						{userProfile?.shortBio && (
							<Box paddingX={2}>
								<MarkdownContent>
									{userProfile.shortBio}
								</MarkdownContent>
							</Box>
						)}
						<Box sx={{
							paddingY: 2,
							borderBottom: 1,
							borderColor: 'divider',
						}}>
							<Tabs value={selectedTab}>
								{Object.values(TabPaths).map(t => (
									<Link
										key={t.value}
										legacyBehavior
										passHref
										href={t.path(username)}
										// @ts-ignore TODO Why is this needed here instead of on Tab?
										value={t.value}
									>
										<Tab label={t.label} />
									</Link>
								))}
							</Tabs>
						</Box>
					</Box>
				}
			>
				<Container>
					{selectedTab === TabPaths.projects.value && (
						<>
							{!!projects?.length && (
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
							)}
							{!projects?.length && (
								<Typography>
									No projects yet
								</Typography>
							)}
						</>
					)}
					{selectedTab === TabPaths.journals.value && (
						<>
							{!!journals?.length && (
								<JournalsList journals={journals} />
							)}
							{!journals?.length && (
								<Typography>
									No journal posts yet
								</Typography>
							)}
						</>
					)}
					{selectedTab === TabPaths.about.value && (
						<>
							{!!userProfile?.detailedBio && (
								<MarkdownContent>
									{userProfile.detailedBio}
								</MarkdownContent>
							)}
							{!userProfile?.detailedBio && (
								<Typography>
									No details about {username} yet
								</Typography>
							)}
						</>
					)}
				</Container>
			</ScrollContent>
		</>
	);
}
