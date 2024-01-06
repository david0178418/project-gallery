import { fetchProject } from '@server/queries';
import { ReactNode } from 'react';
import { EditIcon } from '@components/icons';
import Link from 'next/link';
import { getServerSession } from '@server/auth-options';
import { MongoIdValidation } from '@server/validations';
import { Paths } from '@common/constants';
import ImageSelector from './image-selector';
import {
	Box,
	Container,
	Fab,
	Typography,
} from '@ui';

interface Props {
	children: ReactNode;
	params: {
		projectId: string;
	};
}

export default async function ProjectLayout(props: Props) {
	const {
		children,
		params: { projectId },
	} = props;

	const result = await MongoIdValidation.safeParseAsync(projectId);

	if(!result.success) {
		return (
			<>
				Project not found.
			</>
		);
	}

	const project = result.success ?
		await fetchProject(result.data) :
		null;

	if(!project) {
		return (
			<>
				Project not found.
			</>
		);
	}

	const session = await getServerSession();
	const isOwner = session?.user.id === project.owner._id.toString();

	return (
		<Container>
			<Box paddingTop={1} paddingBottom={2} textAlign="center" >
				<Typography variant="h5" component="div">
					{project.title}
				</Typography>
				<Typography fontSize="small">
					by {project.owner.username}
				</Typography>
				<Box
					maxWidth={700}
					width="100%"
					display="inline-block"
				>
					<ImageSelector images={project.images} />
				</Box>
			</Box>
			<Box paddingX={2} paddingY={1}>
				{children}
			</Box>
			{isOwner && (
				<Link href={Paths.ProjectEdit(projectId)}>
					<Fab
						color="primary"
						sx={{
							position: 'fixed',
							bottom: 64,
							right: {
								xs: 16,
								md: 32,
							},
						}}
					>
						<EditIcon />
					</Fab>
				</Link>
			)}
		</Container>
	);
}
