import { fetchProject } from '@server/queries';
import { ReactNode, Suspense } from 'react';
import { MongoIdValidation } from '@server/validations';
import { Paths } from '@common/constants';
import ImageSelector from './image-selector';
import EditButton from '@components/edit-button.server';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

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
			<Suspense>
				<EditButton
					userId={project.owner._id.toString()}
					href={Paths.ProjectEdit(projectId)}
				/>
			</Suspense>
		</Container>
	);
}
