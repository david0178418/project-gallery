// 'use client';
// import Head from 'next/head';
// import { useRouteBackDefault, useUser } from '@common/hooks';
// import { ScrollContent } from '@components/scroll-content';
// import { BackIcon, EditIcon } from '@components/icons';
// import { GetServerSideProps } from 'next';
// import { getServerSession } from '@server/auth-options';
// import { dbJournalToUiJournal, dbProjectToUiProject } from '@server/transforms';
// import { UiProject } from '@common/types/Project';
// import { MongoIdValidation } from '@server/validations';
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
// import { fetchProject, fetchProjectJournals } from '@server/queries';
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

import { Paths, SpecialCharacterCodes } from '@common/constants';
import { fetchProject } from '@server/queries';
import { MongoIdValidation } from '@server/validations';
import {
	Box,
	Fab,
	IconButton,
	Link,
	Typography,
} from '@ui';
import { ScrollContent } from '@components/scroll-content';
import { BackIcon, EditIcon } from '@components/icons';
import { ReactNode } from 'react';
import ProjectTabs from './project-tabs';
import { getServerSession } from '@server/auth-options';
import BackButton from '@components/back-button';

interface Props {
	children: ReactNode;
	params: {
		projectId: string;
		tab?: string[];
	};
}

export default
async function Page(props: Props) {
	const {
		children,
		params: { projectId },
	} = props;

	const result = await MongoIdValidation.safeParseAsync(projectId);

	const project = result.success ?
		await fetchProject(projectId) :
		null;

	if(!project) {
		return (
			<Typography>
				Invalid Project
			</Typography>
		);
	}

	const session = await getServerSession();
	const isOwner = project.owner._id.toString() === session?.user.id;

	return (
		<>
			<ScrollContent
				header={
					<Box sx={{
						paddingTop: 1,
						paddingBottom: 2,
						paddingX: 1,
					}}>
						<Typography variant="h5" component="div" gutterBottom>
							{/** TODO Capture direct links and send them to home page */}
							<BackButton />
							{project?.title || 'Not Found'}
						</Typography>
						<Typography variant="subtitle2">
							<Link href={Paths.UserGallery(project.owner.username)}>
								By {project.owner.username}
							</Link>
						</Typography>
						<Box sx={{
							paddingTop: 2,
							borderBottom: 1,
							borderColor: 'divider',
						}}>
							<ProjectTabs projectId={project._id.toString()} />
						</Box>
					</Box>
				}
			>
				{children}
			</ScrollContent>
			{isOwner && (
				<Link href={Paths.ProjectEdit(projectId)} >
					<Fab
						color="primary"
						sx={{
							position: 'absolute',
							bottom: 64,
							right: 16,
						}}
					>
						<EditIcon />
					</Fab>
				</Link>
			)}
		</>
	);
}
