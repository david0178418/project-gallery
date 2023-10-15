import { Paths } from '@common/constants';
import { fetchProject } from '@server/queries';
import { MongoIdValidation } from '@server/validations';
import {
	Box,
	Fab,
	Link,
	Typography,
} from '@ui';
import { ScrollContent } from '@components/scroll-content';
import { EditIcon } from '@components/icons';
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
