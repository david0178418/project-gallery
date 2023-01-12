import Head from 'next/head';
import { useRouteBackDefault, useUser } from '@common/hooks';
import { ScrollContent } from '@components/scroll-content';
import { BackIcon, EditIcon } from '@components/icons';
import { GetServerSideProps } from 'next';
import { getServerSession } from '@server/auth-options';
import { dbJournalToUiJournal, dbProjectToUiProject } from '@server/transforms';
import { UiProject } from '@common/types/Project';
import { MongoIdValidation } from '@server/validations';
import { localizedDateFormat, urlJoin } from '@common/utils';
import { ParsedContent } from '@components/parsed-content';
import Link from 'next/link';
import { ImagePreviews } from '@components/image-previews';
import { useState } from 'react';
import { NextSeo } from 'next-seo';
import { UiJournal } from '@common/types/Journal';
import {
	fetchProject,
	fetchProjectJournals,
} from '@server/queries';
import {
	AppName,
	BaseUrl,
	Paths,
	SpecialCharacterCodes,
} from '@common/constants';
import {
	Box,
	Fab,
	IconButton,
	Tab,
	Tabs,
	Typography,
} from '@mui/material';
import JournalsList from '@components/journals-list';

interface Props {
	journals: UiJournal[] | null;
	project: UiProject | null;
}

export
const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
	const result = await MongoIdValidation.safeParseAsync(ctx.query.projectId);
	const session = await getServerSession(ctx.req, ctx.res);
	const [subPath] = ctx.params?.params || [];

	if(!result.success) {
		return {
			props: {
				session,
				project: null,
				journals: subPath === 'journals' ?
					[] as UiJournal[] :
					null,
			},
		};
	}

	const id = result.data;
	const project = await fetchProject(id);
	const journals = subPath === 'journals' ?
		await fetchProjectJournals(id, session?.user.id) :
		null;

	return {
		props: {
			session,
			journals: journals && journals?.map(dbJournalToUiJournal),
			project: project && dbProjectToUiProject(project),
		},
	};
};

export default
function UserGallery(props: Props) {
	const {
		project,
		journals,
	} = props;

	const [activeImage, setActiveImage] = useState(project?.images[0]);
	const routeBack = useRouteBackDefault();
	const user = useUser();
	const isOwner = !!project && user?.id === project.owner._id;
	const url = project ?
		urlJoin(BaseUrl, Paths.Journal(project._id)) :
		'';
	const description = project ?
		project.summary :
		'';
	const title = project ?
		`${project.title} - ${AppName}` :
		'';

	return (
		<>
			<Head>
				<title>{`${project?.title || '???'} - ${AppName}`}</title>
			</Head>
			<NextSeo
				openGraph={{
					url,
					siteName: AppName,
					title,
					description,
					images: [{ url: project?.images[0]?.url || '' }],
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
							{project?.title || 'Not Found'}
						</Typography>
					</Box>
				}
			>
				{project && (
					<>
						<Typography variant="subtitle2">
							<Link href={Paths.UserGallery(project.owner.username)}>
								By {project.owner.username}
							</Link>
						</Typography>
						<Typography variant="subtitle1" paddingTop={1} fontStyle="italic">
							created: {localizedDateFormat(project.projectCreatedDate)}<br/>
						</Typography>
						<Typography variant="subtitle1" fontStyle="italic">
							last updated: {localizedDateFormat(project.projectLastUpdatedDate)}
						</Typography>
						<Typography paddingTop={2}>
							<ParsedContent>
								{`Summary: ${project.summary}`}
							</ParsedContent>
						</Typography>
						<Box sx={{
							paddingTop: 2,
							borderBottom: 1,
							borderColor: 'divider',
						}}>
							<Tabs value={journals ? 'journals' : 'details'}>
								<Link
									href={Paths.Project(project._id)}
									legacyBehavior
									passHref
									// @ts-ignore TODO Why is this needed here instead of on Tab?
									value="details"
								>
									<Tab label="Details" />
								</Link>
								<Link
									href={Paths.ProjectJournals(project._id)}
									legacyBehavior
									passHref
									// @ts-ignore TODO Why is this needed here instead of on Tab?
									value="journals"
								>
									<Tab label="Journals" />
								</Link>
							</Tabs>
						</Box>
						{!journals && (
							<>
								<Box paddingTop={2} textAlign="center">
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src={activeImage?.url}
										style={{
											maxWidth: '100%',
											height: 400,
											objectFit: 'contain',
										}}
									/>
								</Box>
								<ImagePreviews
									images={project.images}
									onClick={setActiveImage}
								/>
								<Typography paddingTop={2}>
									<ParsedContent>
										{project.summary}
									</ParsedContent>
								</Typography>
							</>
						)}
						{!!journals && (
							<JournalsList journals={journals} />
						)}
					</>
				)}
			</ScrollContent>
			{isOwner && (
				<Link
					legacyBehavior
					href={Paths.ProjectEdit(project._id)}
				>
					<Fab
						color="primary"
						sx={{
							position: 'absolute',
							bottom: 64,
							right: 16,
						}}
					>
						<EditIcon/>
					</Fab>
				</Link>
			)}
		</>
	);
}
