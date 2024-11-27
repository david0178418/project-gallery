import { fetchProject } from '@server/queries';
import { ReactNode } from 'react';
import { MongoIdValidation } from '@server/validations';
import ImageSelector from './(standalone-pages)/image-selector';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import MarkdownContent from '@components/markdown-content';

interface Props {
	children: ReactNode;
	params: Promise<{
		projectId: string;
	}>;
}

export default async function ProjectLayout(props: Props) {
	const { projectId } = await props.params;

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
				{project.description && (
					<Box textAlign="center" paddingBottom={2}>
						<Box maxWidth={600} display="inline-block" textAlign="left">
							<MarkdownContent>
								{project.description}
							</MarkdownContent>
						</Box>
					</Box>
				)}
				{props.children}
			</Box>
		</Container>
	);
}
