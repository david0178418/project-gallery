import { UsernameValidation } from '@common/types/UserCredentials';
import { ScrollContent } from '@components/scroll-content';
import {
	Box, Container, Typography,
} from '@ui';
import { fetchUser, fetchUserProfileByUsername } from '@server/queries';
import { SpecialCharacterCodes } from '@common/constants';
import BackButton from '@components/back-button';
import MarkdownContent from '@components/markdown-content';
import TabSection from './tab-section';
import { ReactNode } from 'react';

interface Props {
	children: ReactNode;
	params: {
		username: string;
	}
}

export default async function UserGalleryLayout(props: Props) {
	const {
		children,
		params: { username: routeUsername },
	} = props;
	const result = await UsernameValidation.safeParseAsync(routeUsername);

	if(!result.success) {
		return (
			<>
				User not found.
			</>
		);
	}

	const pageUser = await fetchUser(result.data);
	const username = pageUser?.username;

	if(!username) {
		return (
			<>
				User not found.
			</>
		);
	}

	const userProfile = await fetchUserProfileByUsername(username);

	return (
		<ScrollContent
			header={
				<Box sx={{
					paddingTop: 1,
					paddingBottom: 2,
				}}>
					<Typography variant="h5" component="div" gutterBottom>
						<BackButton />{SpecialCharacterCodes.NBSP}
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
						<TabSection username={username} />
					</Box>
				</Box>
			}
		>
			<Container>
				{children}
			</Container>
		</ScrollContent>
	);
}

// export default
// async function UserGalleryPage(props: any) {
// 	const result = await UsernameValidation.safeParseAsync(ctx.query.username);
// 	const session = await getServerSession();
// 	const [rawSubPath] = ctx.params?.params || [];
// 	const subPath = TabPaths[rawSubPath as TabPath]?.value || TabPaths.projects.value;

// 	if(!result.success) {
// 		return {
// 			props: {
// 				session,
// 				subPath,
// 				username: 'unknown',
// 				unknownUser: true,
// 				userProfile: null,
// 				projects: [],
// 				journals: [],
// 			},
// 		};
// 	}

// 	const pageUser = await fetchUser(result.data);
// 	const username = pageUser?.username;

// 	if(!username) {
// 		return {
// 			props: {
// 				session,
// 				subPath,
// 				username: 'unknown',
// 				unknownUser: true,
// 				userProfile: null,
// 				projects: [],
// 				journals: [],
// 			},
// 		};
// 	}

// 	const dbUserProfile = await fetchUserProfileByUsername(username);
// 	const isOwner = !!username && (username === session?.user.username);
// 	const projects = (await fetchUserGallery(username)).map(dbProjectToUiProject);
// 	const journals = (await fetchUserJournals(username, isOwner)).map(dbJournalToUiJournal);

// 	// TODO Clean up all the filtering and routing stuff
// 	const {
// 		isOwner,
// 		username,
// 		subPath: selectedTab,
// 		projects: defaultProjects,
// 		userProfile,
// 		journals,
// 	} = props;
// 	const routeBack = useRouteBackDefault();
// 	const [projects, setProjects] = useState(defaultProjects);
// 	const pustToastMsg = useSetAtom(pushToastMsgAtom);
// 	const {
// 		push,
// 		pathname,
// 		query,
// 	} = useRouter();
// 	const {
// 		selectedLabels: rawSelectedLabels = '',
// 		...otherQueryParams
// 	} = query;
// 	const selectedLabels = typeof rawSelectedLabels === 'string' ?
// 		rawSelectedLabels.split(',').filter(isTruthy) :
// 		rawSelectedLabels;
// 	const uniqueLabels = projects ?
// 		uniqueBy(projects.flatMap(p => p.labels), 'label') :
// 		[];
// 	const handleLabelSelect = useCallback((label: string) => {
// 		const newSelectedLabels = selectedLabels.includes(label) ?
// 			unique(selectedLabels.filter(l => l !== label)) :
// 			unique([ ...selectedLabels, label]);

// 		const newQuery: UrlObject['query'] = { ...otherQueryParams };

// 		if(newSelectedLabels.length) {
// 			newQuery.selectedLabels = newSelectedLabels.join(',');
// 		}

// 		push({
// 			query: newQuery,
// 			pathname: pathname,
// 		});
// 	}, [selectedLabels.join(',')]);
// 	const handleMoveLeft = useCallback(async (projectIndex: number) => {
// 		if(!projects) {
// 			return;
// 		}

// 		setProjects(moveItemLeft(projects, projectIndex));

// 		try {
// 			await updateProjectOrder(projects[projectIndex]._id, Direction.Left);
// 		} catch {
// 			setProjects(projects);
// 			pustToastMsg('Something went wrong');
// 		}
// 	}, [projects]);
// 	const handleMoveRight = useCallback(async (projectIndex: number) => {
// 		if(!projects) {
// 			return;
// 		}

// 		setProjects(moveItemRight(projects, projectIndex));

// 		try {
// 			await updateProjectOrder(projects[projectIndex]._id, Direction.Right);
// 		} catch {
// 			setProjects(projects);
// 			pustToastMsg('Something went wrong');
// 		}
// 	}, [projects]);

// 	const title = `${username}'s Gallery - ${AppName}`;
// 	const url = Paths.UserGallery(username);
// 	const description = userProfile?.shortBio || '';
// 	// TODO CLean this mess up
// 	const filteredProjects = projects?.filter(
// 		p => !selectedLabels.length ||
// 			p.labels.some(l => selectedLabels.includes(l.label))
// 	) || [];

// 	return (
// 		<>
// 			<Head>
// 				<title>{title}</title>
// 			</Head>
// 			<NextSeo
// 				openGraph={{
// 					url,
// 					siteName: AppName,
// 					title,
// 					description,
// 				}}
// 			/>
// 			<ScrollContent
// 				header={
// 					<Box sx={{
// 						paddingTop: 1,
// 						paddingBottom: 2,
// 					}}>
// 						<Typography variant="h5" component="div" gutterBottom>
// 							{/** TODO Capture direct links and send them to home page */}
// 							<IconButton color="primary" onClick={routeBack}>
// 								<BackIcon />
// 							</IconButton>{SpecialCharacterCodes.NBSP}
// 							{username}{SpecialCharacterCodes.RSQUO}s Gallery
// 						</Typography>
// 						{userProfile?.shortBio && (
// 							<Box paddingX={2}>
// 								<MarkdownContent>
// 									{userProfile.shortBio}
// 								</MarkdownContent>
// 							</Box>
// 						)}
// 						<Box sx={{
// 							paddingY: 2,
// 							borderBottom: 1,
// 							borderColor: 'divider',
// 						}}>
// 							<Tabs value={selectedTab}>
// 								{Object.values(TabPaths).map(t => (
// 									<Link
// 										key={t.value}
// 										legacyBehavior
// 										passHref
// 										href={t.path(username)}
// 										// @ts-ignore TODO Why is this needed here instead of on Tab?
// 										value={t.value}
// 									>
// 										<Tab label={t.label} />
// 									</Link>
// 								))}
// 							</Tabs>
// 						</Box>
// 					</Box>
// 				}
// 			>
// 				<Container>
// 					{selectedTab === TabPaths.projects.value && (
// 						<>
// 							{!!projects?.length && (
// 								<>
// 									{!!uniqueLabels.length && (
// 										<Box
// 											paddingBottom={2}
// 											borderBottom={1}
// 											borderColor="divider"
// 										>
// 											<LabelsFilter
// 												labels={uniqueLabels}
// 												selectedLabels={selectedLabels}
// 												onClick={handleLabelSelect}
// 											/>
// 										</Box>
// 									)}
// 									<Grid
// 										padding={1}
// 										container
// 										spacing={1}
// 									>
// 										{filteredProjects.map((p, i) => (
// 											<Grid
// 												item
// 												key={p._id}
// 												xs={12}
// 												md={6}
// 												position="relative"
// 												sx={{
// 													'& .change-order-action': {
// 														xs: { display: 'flex' },
// 														sm: { display: 'none' },
// 													},
// 													'&:hover .change-order-action': { display: 'flex' },
// 												}}
// 											>
// 												<ProjectCard project={p} />
// 												{isOwner && projects && !selectedLabels.length && (
// 													<OrderControlBlock
// 														first={i === 0}
// 														last={i === projects.length - 1}
// 														onMoveLeft={() => handleMoveLeft(i)}
// 														onMoveRight={() => handleMoveRight(i)}
// 													/>
// 												)}
// 											</Grid>
// 										))}
// 									</Grid>
// 								</>
// 							)}
// 							{!projects?.length && (
// 								<Typography>
// 									No projects yet
// 								</Typography>
// 							)}
// 						</>
// 					)}
// 					{selectedTab === TabPaths.journals.value && (
// 						<>
// 							{!!journals?.length && (
// 								<JournalsList journals={journals} />
// 							)}
// 							{!journals?.length && (
// 								<Typography>
// 									No journal posts yet
// 								</Typography>
// 							)}
// 						</>
// 					)}
// 					{selectedTab === TabPaths.about.value && (
// 						<>
// 							{!!userProfile?.detailedBio && (
// 								<MarkdownContent>
// 									{userProfile.detailedBio}
// 								</MarkdownContent>
// 							)}
// 							{!userProfile?.detailedBio && (
// 								<Typography>
// 									No details about {username} yet
// 								</Typography>
// 							)}
// 						</>
// 					)}
// 				</Container>
// 			</ScrollContent>
// 		</>
// 	);
// }

// import Head from 'next/head';
// import ProjectCard from '@components/project-card';
// import { useRouteBackDefault } from '@common/hooks';
// import { ScrollContent } from '@components/scroll-content';
// import { GetServerSideProps } from 'next';
// import { UsernameValidation } from '@common/types/UserCredentials';
// import { UiProject } from '@common/types/Project';
// import { getServerSession } from '@server/auth-options';
// import JournalsList from '@components/journals-list';
// import { UiJournal } from '@common/types/Journal';
// import { UiUserProfile } from '@common/types/UserProfile';
// import MarkdownContent from '@components/markdown-content';
// import { NextSeo } from 'next-seo';
// import Link from 'next/link';
// import { updateProjectOrder } from '@client/api-calls';
// import { useSetAtom } from 'jotai';
// import { pushToastMsgAtom } from '@common/atoms';
// import { useCallback, useState } from 'react';
// import LabelsFilter from '@components/labels-filter';
// import { useRouter } from 'next/router';
// import { UrlObject } from 'url';
// import {
// 	isTruthy,
// 	moveItemLeft,
// 	moveItemRight,
// 	unique,
// 	uniqueBy,
// } from '@common/utils';
// import {
// 	ArrowDownIcon,
// 	ArrowLeftIcon,
// 	ArrowRightIcon,
// 	ArrowUpIcon,
// 	BackIcon,
// } from '@components/icons';
// import {
// 	AppName,
// 	Direction,
// 	Paths,
// 	SpecialCharacterCodes,
// } from '@common/constants';
// import {
// 	dbJournalToUiJournal,
// 	dbProjectToUiProject,
// 	dbUserProfileToUiUserProfile,
// } from '@server/transforms';
// import {
// 	fetchUser,
// 	fetchUserGallery,
// 	fetchUserJournals,
// 	fetchUserProfileByUsername,
// } from '@server/queries';
// import {
// 	Box,
// 	Container,
// 	Grid,
// 	IconButton,
// 	Tab,
// 	Tabs,
// 	Typography,
// } from '@ui';

// const TabPaths = {
// 	projects: {
// 		label: 'Projects',
// 		value: 'projects',
// 		path: (username: string) => Paths.UserGallery(username),
// 	},
// 	journals: {
// 		label: 'Journal Posts',
// 		value: 'journals',
// 		path: (useername: string) => Paths.UserGalleryJournals(useername),
// 	},
// 	about: {
// 		label: 'About',
// 		value: 'about',
// 		path: (username: string) => Paths.UserGalleryAbout(username),
// 	},
// } as const;

// type TabPath = keyof typeof TabPaths;

// interface Props {
// 	isOwner?: boolean;
// 	unknownUser?: boolean;
// 	username: string;
// 	subPath: TabPath;
// 	userProfile: UiUserProfile | null;
// 	projects: UiProject[] | null;
// 	journals: UiJournal[] | null;
// }

// export
// const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
// 	const result = await UsernameValidation.safeParseAsync(ctx.query.username);
// 	const session = await getServerSession();
// 	const [rawSubPath] = ctx.params?.params || [];
// 	const subPath = TabPaths[rawSubPath as TabPath]?.value || TabPaths.projects.value;

// 	if(!result.success) {
// 		return {
// 			props: {
// 				session,
// 				subPath,
// 				username: 'unknown',
// 				unknownUser: true,
// 				userProfile: null,
// 				projects: [],
// 				journals: [],
// 			},
// 		};
// 	}

// 	const pageUser = await fetchUser(result.data);
// 	const username = pageUser?.username;

// 	if(!username) {
// 		return {
// 			props: {
// 				session,
// 				subPath,
// 				username: 'unknown',
// 				unknownUser: true,
// 				userProfile: null,
// 				projects: [],
// 				journals: [],
// 			},
// 		};
// 	}

// 	const dbUserProfile = await fetchUserProfileByUsername(username);
// 	const isOwner = !!username && (username === session?.user.username);
// 	const projects = (await fetchUserGallery(username)).map(dbProjectToUiProject);
// 	const journals = (await fetchUserJournals(username, isOwner)).map(dbJournalToUiJournal);

// 	return {
// 		props: {
// 			isOwner,
// 			session,
// 			subPath,
// 			username,
// 			projects,
// 			journals,
// 			userProfile: dbUserProfile && dbUserProfileToUiUserProfile(dbUserProfile),
// 		},
// 	};
// };

// export default
// async function UserGalleryPage(props: Props) {

// 	const result = await UsernameValidation.safeParseAsync(ctx.query.username);
// 	const session = await getServerSession();
// 	const [rawSubPath] = ctx.params?.params || [];
// 	const subPath = TabPaths[rawSubPath as TabPath]?.value || TabPaths.projects.value;

// 	if(!result.success) {
// 		return {
// 			props: {
// 				session,
// 				subPath,
// 				username: 'unknown',
// 				unknownUser: true,
// 				userProfile: null,
// 				projects: [],
// 				journals: [],
// 			},
// 		};
// 	}

// 	const pageUser = await fetchUser(result.data);
// 	const username = pageUser?.username;

// 	if(!username) {
// 		return {
// 			props: {
// 				session,
// 				subPath,
// 				username: 'unknown',
// 				unknownUser: true,
// 				userProfile: null,
// 				projects: [],
// 				journals: [],
// 			},
// 		};
// 	}

// 	const dbUserProfile = await fetchUserProfileByUsername(username);
// 	const isOwner = !!username && (username === session?.user.username);
// 	const projects = (await fetchUserGallery(username)).map(dbProjectToUiProject);
// 	const journals = (await fetchUserJournals(username, isOwner)).map(dbJournalToUiJournal);

// 	// TODO Clean up all the filtering and routing stuff
// 	const {
// 		isOwner,
// 		username,
// 		subPath: selectedTab,
// 		projects: defaultProjects,
// 		userProfile,
// 		journals,
// 	} = props;
// 	const routeBack = useRouteBackDefault();
// 	const [projects, setProjects] = useState(defaultProjects);
// 	const pustToastMsg = useSetAtom(pushToastMsgAtom);
// 	const {
// 		push,
// 		pathname,
// 		query,
// 	} = useRouter();
// 	const {
// 		selectedLabels: rawSelectedLabels = '',
// 		...otherQueryParams
// 	} = query;
// 	const selectedLabels = typeof rawSelectedLabels === 'string' ?
// 		rawSelectedLabels.split(',').filter(isTruthy) :
// 		rawSelectedLabels;
// 	const uniqueLabels = projects ?
// 		uniqueBy(projects.flatMap(p => p.labels), 'label') :
// 		[];
// 	const handleLabelSelect = useCallback((label: string) => {
// 		const newSelectedLabels = selectedLabels.includes(label) ?
// 			unique(selectedLabels.filter(l => l !== label)) :
// 			unique([ ...selectedLabels, label]);

// 		const newQuery: UrlObject['query'] = { ...otherQueryParams };

// 		if(newSelectedLabels.length) {
// 			newQuery.selectedLabels = newSelectedLabels.join(',');
// 		}

// 		push({
// 			query: newQuery,
// 			pathname: pathname,
// 		});
// 	}, [selectedLabels.join(',')]);
// 	const handleMoveLeft = useCallback(async (projectIndex: number) => {
// 		if(!projects) {
// 			return;
// 		}

// 		setProjects(moveItemLeft(projects, projectIndex));

// 		try {
// 			await updateProjectOrder(projects[projectIndex]._id, Direction.Left);
// 		} catch {
// 			setProjects(projects);
// 			pustToastMsg('Something went wrong');
// 		}
// 	}, [projects]);
// 	const handleMoveRight = useCallback(async (projectIndex: number) => {
// 		if(!projects) {
// 			return;
// 		}

// 		setProjects(moveItemRight(projects, projectIndex));

// 		try {
// 			await updateProjectOrder(projects[projectIndex]._id, Direction.Right);
// 		} catch {
// 			setProjects(projects);
// 			pustToastMsg('Something went wrong');
// 		}
// 	}, [projects]);

// 	const title = `${username}'s Gallery - ${AppName}`;
// 	const url = Paths.UserGallery(username);
// 	const description = userProfile?.shortBio || '';
// 	// TODO CLean this mess up
// 	const filteredProjects = projects?.filter(
// 		p => !selectedLabels.length ||
// 			p.labels.some(l => selectedLabels.includes(l.label))
// 	) || [];

// 	return (
// 		<>
// 			<Head>
// 				<title>{title}</title>
// 			</Head>
// 			<NextSeo
// 				openGraph={{
// 					url,
// 					siteName: AppName,
// 					title,
// 					description,
// 				}}
// 			/>
// 			<ScrollContent
// 				header={
// 					<Box sx={{
// 						paddingTop: 1,
// 						paddingBottom: 2,
// 					}}>
// 						<Typography variant="h5" component="div" gutterBottom>
// 							{/** TODO Capture direct links and send them to home page */}
// 							<IconButton color="primary" onClick={routeBack}>
// 								<BackIcon />
// 							</IconButton>{SpecialCharacterCodes.NBSP}
// 							{username}{SpecialCharacterCodes.RSQUO}s Gallery
// 						</Typography>
// 						{userProfile?.shortBio && (
// 							<Box paddingX={2}>
// 								<MarkdownContent>
// 									{userProfile.shortBio}
// 								</MarkdownContent>
// 							</Box>
// 						)}
// 						<Box sx={{
// 							paddingY: 2,
// 							borderBottom: 1,
// 							borderColor: 'divider',
// 						}}>
// 							<Tabs value={selectedTab}>
// 								{Object.values(TabPaths).map(t => (
// 									<Link
// 										key={t.value}
// 										legacyBehavior
// 										passHref
// 										href={t.path(username)}
// 										// @ts-ignore TODO Why is this needed here instead of on Tab?
// 										value={t.value}
// 									>
// 										<Tab label={t.label} />
// 									</Link>
// 								))}
// 							</Tabs>
// 						</Box>
// 					</Box>
// 				}
// 			>
// 				<Container>
// 					{selectedTab === TabPaths.projects.value && (
// 						<>
// 							{!!projects?.length && (
// 								<>
// 									{!!uniqueLabels.length && (
// 										<Box
// 											paddingBottom={2}
// 											borderBottom={1}
// 											borderColor="divider"
// 										>
// 											<LabelsFilter
// 												labels={uniqueLabels}
// 												selectedLabels={selectedLabels}
// 												onClick={handleLabelSelect}
// 											/>
// 										</Box>
// 									)}
// 									<Grid
// 										padding={1}
// 										container
// 										spacing={1}
// 									>
// 										{filteredProjects.map((p, i) => (
// 											<Grid
// 												item
// 												key={p._id}
// 												xs={12}
// 												md={6}
// 												position="relative"
// 												sx={{
// 													'& .change-order-action': {
// 														xs: { display: 'flex' },
// 														sm: { display: 'none' },
// 													},
// 													'&:hover .change-order-action': { display: 'flex' },
// 												}}
// 											>
// 												<ProjectCard project={p} />
// 												{isOwner && projects && !selectedLabels.length && (
// 													<OrderControlBlock
// 														first={i === 0}
// 														last={i === projects.length - 1}
// 														onMoveLeft={() => handleMoveLeft(i)}
// 														onMoveRight={() => handleMoveRight(i)}
// 													/>
// 												)}
// 											</Grid>
// 										))}
// 									</Grid>
// 								</>
// 							)}
// 							{!projects?.length && (
// 								<Typography>
// 									No projects yet
// 								</Typography>
// 							)}
// 						</>
// 					)}
// 					{selectedTab === TabPaths.journals.value && (
// 						<>
// 							{!!journals?.length && (
// 								<JournalsList journals={journals} />
// 							)}
// 							{!journals?.length && (
// 								<Typography>
// 									No journal posts yet
// 								</Typography>
// 							)}
// 						</>
// 					)}
// 					{selectedTab === TabPaths.about.value && (
// 						<>
// 							{!!userProfile?.detailedBio && (
// 								<MarkdownContent>
// 									{userProfile.detailedBio}
// 								</MarkdownContent>
// 							)}
// 							{!userProfile?.detailedBio && (
// 								<Typography>
// 									No details about {username} yet
// 								</Typography>
// 							)}
// 						</>
// 					)}
// 				</Container>
// 			</ScrollContent>
// 		</>
// 	);
// }

// interface OrderControlBlockProps {
// 	first?: boolean;
// 	last?: boolean;
// 	onMoveLeft(): void;
// 	onMoveRight(): void;
// }

// function OrderControlBlock(props: OrderControlBlockProps) {
// 	const {
// 		onMoveLeft,
// 		onMoveRight,
// 		last,
// 		first,
// 	} = props;
// 	return (
// 		<Box
// 			top={0}
// 			position="absolute"
// 			width="100%"
// 			className="change-order-action"
// 		>
// 			{!first && (
// 				<Box>
// 					<IconButton
// 						size="large"
// 						onClick={onMoveLeft}
// 					>
// 						<Box
// 							component={ArrowLeftIcon}
// 							display={{
// 								xs: 'none',
// 								sm: 'inline',
// 							}}
// 						/>
// 						<Box
// 							component={ArrowUpIcon}
// 							display={{
// 								xs: 'inline',
// 								sm: 'none',
// 							}}
// 						/>
// 					</IconButton>
// 				</Box>
// 			)}
// 			{!last && (
// 				<Box marginLeft="auto">
// 					<IconButton
// 						size="large"
// 						onClick={onMoveRight}
// 					>
// 						<Box
// 							component={ArrowRightIcon}
// 							display={{
// 								xs: 'none',
// 								sm: 'inline',
// 							}}
// 						/>
// 						<Box
// 							component={ArrowDownIcon}
// 							display={{
// 								xs: 'inline',
// 								sm: 'none',
// 							}}
// 						/>
// 					</IconButton>
// 				</Box>
// 			)}
// 		</Box>
// 	);
// }
