// import Head from 'next/head';
// import { useRouteBackDefault, useUser } from '@common/hooks';
// import { ScrollContent } from '@components/scroll-content';
// import { BackIcon, EditIcon } from '@components/icons';
// import { UiProject } from '@common/types/Project';
// import { urlJoin } from '@common/utils';
// import Link from 'next/link';
// import { ImagePreviews } from '@components/image-previews';
// import { useState } from 'react';
// import { NextSeo } from 'next-seo';
// import { UiJournal } from '@common/types/Journal';
// import JournalsList from '@components/journals-list';
// import MarkdownContent from '@components/markdown-content';
// import LinksList from '@components/links-list';
// import { LocalizedDate } from '@components/localized-date';
// import {
// 	AppName,
// 	BaseUrl,
// 	Paths,
// 	SpecialCharacterCodes,
// } from '@common/constants';
// import {
// 	Box,
// 	Container,
// 	Fab,
// 	IconButton,
// 	Tab,
// 	Tabs,
// 	Typography,
// } from '@ui';
import { DbJournal } from '@common/types/Journal';
import { DbProject } from '@common/types/Project';
// import { urlJoin } from '@common/utils';
// import { ScrollContent } from '@components/scroll-content';
// import { getServerSession } from '@server/auth-options';
// import { BackIcon } from '@components/icons';
import { Paths } from '@common/constants';

interface Props {
	subPath: TabPath ;
	journals: DbJournal[] | null;
	project: DbProject | null;
}

const TabPaths = {
	details: {
		label: 'Details',
		value: 'details',
		path: (projectId: string) => Paths.Project(projectId),
	},
	journals: {
		label: 'Journal',
		value: 'journals',
		path: (projectId: string) => Paths.ProjectJournals(projectId),
	},
	links: {
		label: 'Links',
		value: 'links',
		path: (projectId: string) => Paths.ProjectLinks(projectId),
	},
} as const;

type TabPath = keyof typeof TabPaths;

export default
async function UserGallery(props: Props) {
	// const {
	// 	subPath: selectedTab,
	// 	project,
	// 	journals,
	// } = props;

	// const [activeImage, setActiveImage] = useState(project?.images[0]);
	// const routeBack = useRouteBackDefault();
	// const user = useUser();
	// const isOwner = !!project && user?.id === project.owner._id;
	// const url = project ?
	// 	urlJoin(BaseUrl, Paths.Journal(project._id)) :
	// 	'';
	// const description = project ?
	// 	project.description :
	// 	'';
	// const title = project ?
	// 	`${project.title || '???'}${journals ? ' Journal' : '' } - ${AppName}` :
	// 	'';

	// return (
	// 	<>
	// 		<Head>
	// 			<title>{title}</title>
	// 		</Head>
	// 		<NextSeo
	// 			openGraph={{
	// 				url,
	// 				siteName: AppName,
	// 				title,
	// 				description,
	// 				images: [{ url: project?.images[0]?.url || '' }],
	// 			}}
	// 		/>
	// 		<ScrollContent
	// 			header={
	// 				<Box sx={{
	// 					paddingTop: 1,
	// 					paddingBottom: 2,
	// 					paddingX: 1,
	// 				}}>
	// 					{project && (
	// 						<>
	// 							<Typography variant="h5" component="div" gutterBottom>
	// 								{/** TODO Capture direct links and send them to home page */}
	// 								<IconButton color="primary" onClick={routeBack}>
	// 									<BackIcon />
	// 								</IconButton>{SpecialCharacterCodes.NBSP}
	// 								{project?.title || 'Not Found'}
	// 							</Typography>
	// 							<Typography variant="subtitle2">
	// 								<Link href={Paths.UserGallery(project.owner.username)}>
	// 							By {project.owner.username}
	// 								</Link>
	// 							</Typography>
	// 							<Box sx={{
	// 								paddingTop: 2,
	// 								borderBottom: 1,
	// 								borderColor: 'divider',
	// 							}}>
	// 								<Tabs value={selectedTab}>
	// 									{Object.values(TabPaths).map(t => (
	// 										<Link
	// 											key={t.value}
	// 											legacyBehavior
	// 											passHref
	// 											href={t.path(project._id)}
	// 											// @ts-ignore TODO Why is this needed here instead of on Tab?
	// 											value={t.value}
	// 										>
	// 											<Tab label={t.label} />
	// 										</Link>
	// 									))}
	// 								</Tabs>
	// 							</Box>
	// 						</>
	// 					)}
	// 				</Box>
	// 			}
	// 		>
	// 			{project && (
	// 				<Container>
	// 					{selectedTab === TabPaths.details.value && (
	// 						<>
	// 							<Typography variant="subtitle1" paddingTop={1} fontStyle="italic">
	// 							created: <LocalizedDate date={project.projectCreatedDate} /><br/>
	// 							</Typography>
	// 							<Typography variant="subtitle1" fontStyle="italic">
	// 							last updated: <LocalizedDate date={project.projectLastUpdatedDate} />
	// 							</Typography>
	// 							<Box paddingTop={2} textAlign="center">
	// 								{/* eslint-disable-next-line @next/next/no-img-element */}
	// 								<img
	// 									src={activeImage?.url}
	// 									style={{
	// 										maxWidth: '100%',
	// 										height: 400,
	// 										objectFit: 'contain',
	// 									}}
	// 								/>
	// 							</Box>
	// 							<ImagePreviews
	// 								images={project.images}
	// 								onClick={setActiveImage}
	// 							/>
	// 							<Typography paddingTop={2} component="div">
	// 								<MarkdownContent plaintext>
	// 									{project.description}
	// 								</MarkdownContent>
	// 							</Typography>
	// 						</>
	// 					)}y
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
	// 					{selectedTab === TabPaths.links.value && (
	// 						<>
	// 							{!!project.links.length && (
	// 								<LinksList links={project.links} />
	// 							)}
	// 							{!project.links.length && (
	// 								<Typography>
	// 									No links yet
	// 								</Typography>
	// 							)}
	// 						</>
	// 					)}
	// 				</Container>
	// 			)}
	// 		</ScrollContent>
	// 		{isOwner && (
	// 			<Link
	// 				legacyBehavior
	// 				href={Paths.ProjectEdit(project._id)}
	// 			>
	// 				<Fab
	// 					color="primary"
	// 					sx={{
	// 						position: 'absolute',
	// 						bottom: 64,
	// 						right: 16,
	// 					}}
	// 				>
	// 					<EditIcon/>
	// 				</Fab>
	// 			</Link>
	// 		)}
	// 	</>
	// );

	// const {
	// 	subPath: selectedTab,
	// 	project,
	// 	journals,
	// } = props;
	// const [activeImage, setActiveImage] = useState(project?.images[0]);
	// const activeImage = project?.images[0];
	// const routeBack = useRouteBackDefault();
	// const user = useUser();
	// const session = await getServerSession();
	// const user = session?.user;
	// const isOwner = !!project && user?.id === project.owner._id.toString();
	// const url = project ?
	// 	urlJoin(BaseUrl, Paths.Journal(project._id.toString())) :
	// 	'';

	return (
		<>
			<pre>
				{JSON.stringify(props, null, 4)}
			</pre>
		</>
	);
}
