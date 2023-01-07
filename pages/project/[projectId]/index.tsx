import Head from 'next/head';
import { useRouteBackDefault, useUser } from '@common/hooks';
import { ScrollContent } from '@components/scroll-content';
import { BackIcon, EditIcon } from '@components/icons';
import { GetServerSideProps } from 'next';
import { getServerSession } from '@server/auth-options';
import { fetchProject } from '@server/queries';
import { dbProjectToUiProject } from '@server/transforms';
import { UiProject } from '@common/types/Project';
import { MongoIdValidation } from '@server/validations';
import { localizedDateFormat, urlJoin } from '@common/utils';
import { ParsedContent } from '@components/parsed-content';
import Link from 'next/link';
import { ImagePreviews } from '@components/image-previews';
import { useState } from 'react';
import { NextSeo } from 'next-seo';
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
	Typography,
} from '@mui/material';

interface Props {
	project: UiProject | null;
}

export
const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
	const result = await MongoIdValidation.safeParseAsync(ctx.query.projectId);
	const session = await getServerSession(ctx.req, ctx.res);

	if(!result.success) {
		return {
			props: {
				session,
				project: null,
			},
		};
	}

	const id = result.data;
	const project = await fetchProject(id);

	return {
		props: {
			session,
			project: project && dbProjectToUiProject(project),
		},
	};
};

export default
function UserGallery(props: Props) {
	const { project	} = props;
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
