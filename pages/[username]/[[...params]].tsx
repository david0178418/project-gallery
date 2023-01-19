import Head from 'next/head';
import ProjectCard from '@components/project-card';
import { useRouteBackDefault } from '@common/hooks';
import { ScrollContent } from '@components/scroll-content';
import { GetServerSideProps } from 'next';
import { UsernameValidation } from '@common/types/UserCredentials';
import { UiProject } from '@common/types/Project';
import { getServerSession } from '@server/auth-options';
import JournalsList from '@components/journals-list';
import { UiJournal } from '@common/types/Journal';
import { UiUserProfile } from '@common/types/UserProfile';
import MarkdownContent from '@components/markdown-content';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import {
	ArrowDownIcon,
	ArrowLeftIcon,
	ArrowRightIcon,
	ArrowUpIcon,
	BackIcon,
} from '@components/icons';
import {
	AppName,
	Paths,
	SpecialCharacterCodes,
} from '@common/constants';
import {
	dbJournalToUiJournal,
	dbProjectToUiProject,
	dbUserProfileToUiUserProfile,
} from '@server/transforms';
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
import { moveItemLeft, moveItemRight } from '@common/utils';

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
	isOwner?: boolean;
	unknownUser?: boolean;
	username: string;
	subPath: TabPath;
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
			isOwner,
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
	const {
		isOwner,
		username,
		subPath: selectedTab,
		projects: defaultProjects,
		userProfile,
		journals,
	} = props;
	const routeBack = useRouteBackDefault();
	const [projects, setProjects] = useState(defaultProjects);

	const handleMoveLeft = useCallback((projectIndex: number) => {
		if(!projects) {
			return null;
		}

		setProjects(moveItemLeft(projects, projectIndex));
	}, [projects]);
	const handleMoveRight = useCallback((projectIndex: number) => {
		if(!projects) {
			return null;
		}

		setProjects(moveItemRight(projects, projectIndex));
	}, [projects]);

	const title = `${username}'s Gallery - ${AppName}`;
	const url = Paths.UserGallery(username);
	const description = userProfile?.shortBio || '';

	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>
			<NextSeo
				openGraph={{
					url,
					siteName: AppName,
					title,
					description,
				}}
			/>
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
									{projects.map((p, i) => (
										<Grid
											item
											key={p._id}
											xs={12}
											md={6}
											position="relative"
											sx={{
												'& .change-order-action': {
													xs: { display: 'flex' },
													sm: { display: 'none' },
												},
												'&:hover .change-order-action': { display: 'flex' },
											}}
										>
											<ProjectCard
												project={p}
											/>
											{isOwner && (
												<OrderControlBlock
													first={i === 0}
													last={i === projects.length - 1}
													onMoveLeft={() => handleMoveLeft(i)}
													onMoveRight={() => handleMoveRight(i)}
												/>
											)}
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

interface OrderControlBlockProps {
	first?: boolean;
	last?: boolean;
	onMoveLeft(): void;
	onMoveRight(): void;
}

function OrderControlBlock(props: OrderControlBlockProps) {
	const {
		onMoveLeft: onMoveUp,
		onMoveRight: onMoveDown,
		last,
		first,
	} = props;
	return (
		<Box
			top={0}
			position="absolute"
			width="100%"
			className="change-order-action"
		>
			{!first && (
				<Box>
					<IconButton
						size="large"
						onClick={onMoveUp}
					>
						<Box
							component={ArrowLeftIcon}
							display={{
								xs: 'none',
								sm: 'inline',
							}}
						/>
						<Box
							component={ArrowUpIcon}
							display={{
								xs: 'inline',
								sm: 'none',
							}}
						/>
					</IconButton>
				</Box>
			)}
			{!last && (
				<Box marginLeft="auto">
					<IconButton
						size="large"
						onClick={onMoveDown}
					>
						<Box
							component={ArrowRightIcon}
							display={{
								xs: 'none',
								sm: 'inline',
							}}
						/>
						<Box
							component={ArrowDownIcon}
							display={{
								xs: 'inline',
								sm: 'none',
							}}
						/>
					</IconButton>
				</Box>
			)}
		</Box>
	);
}
