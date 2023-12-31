import { Paths } from '@common/constants';
import { fetchProject, fetchUserProfileByUsername } from '@server/queries';
import { MongoIdValidation } from '@server/validations';
import { ScrollContent } from '@components/scroll-content';
import { EditIcon } from '@components/icons';
import { ReactNode } from 'react';
import ProjectTabs from './project-tabs';
import { getServerSession } from '@server/auth-options';
import BackButton from '@components/back-button';
import { red } from '@mui/material/colors';
import {
	Avatar,
	Box,
	Fab,
	Grid,
	Typography,
} from '@ui';
import Link from 'next/link';

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
	const profile = await fetchUserProfileByUsername(project.owner.username);

	return (
		<>
			<ScrollContent
				header={
					<Box
						paddingTop={1}
						paddingBottom={2}
						paddingX={1}
					>
						<Grid container>
							<Grid item xs={6}>
								<Typography variant="h5" component="div" gutterBottom>
									{/** TODO Capture direct links and send them to home page */}
									<BackButton />
								</Typography>
							</Grid>
							<Grid item xs={6} textAlign="right">
								<Typography variant="subtitle2" display="inline-block">
									<Link
										href={Paths.UserGallery(project.owner.username)}
										style={{ textDecoration: 'none' }}
									>
										<Avatar
											src={profile?.avatar}
											sx={{ bgcolor: red[500] }}
										>
											{project.owner.username[0].toLocaleUpperCase()}
										</Avatar>
									</Link>
									<Link href={Paths.UserGallery(project.owner.username)}>
											By {project.owner.username}
									</Link>
								</Typography>
							</Grid>
						</Grid>
						<Box sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
						}}>
							<Typography variant="h5" component="div">
								{project.title}
							</Typography>
						</Box>
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
