import Head from 'next/head';
import {
	AppName, Paths, SpecialCharacterCodes,
} from '@common/constants';
import { useRouteBackDefault } from '@common/hooks';
import { ScrollContent } from '@components/scroll-content';
import { BackIcon } from '@components/icons';
import { GetServerSideProps } from 'next';
import { getServerSession } from '@server/auth-options';
import { fetchProject } from '@server/queries';
import { dbProjectToUiProject } from '@server/transforms';
import { UiProject } from '@common/types/Project';
import { MongoIdValidation } from '@server/validations';
import { localizedDateFormat, urlJoin } from '@common/utils';
import { ParsedContent } from '@components/parsed-content';
import {
	Box,
	IconButton,
	Typography,
} from '@mui/material';
import Link from 'next/link';

interface Props {
	project: UiProject | null;
}

export
const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
	const result = await MongoIdValidation.safeParseAsync(ctx.query.id);
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
	const routeBack = useRouteBackDefault();
	const { project	} = props;

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
							{project?.title || 'Not Found'}
						</Typography>
					</Box>
				}
			>
				{project && (
					<>
						<Typography variant="subtitle2">
							<Link href={urlJoin(Paths.UserGallery, project.owner.username)}>
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
						<Box paddingTop={2}>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img src={project.titleImageUrl} />
						</Box>
						<Typography paddingTop={2}>
							<ParsedContent>
								{project.summary}
							</ParsedContent>
						</Typography>
					</>
				)}
			</ScrollContent>
		</>
	);
}
