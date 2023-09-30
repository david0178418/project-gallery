'use client';
import { UiProject } from '@common/types/Project';
import { ImagePreviews } from '@components/image-previews';
import MarkdownContent from '@components/markdown-content';
import { Box, Typography } from '@ui';
import { useState } from 'react';

interface Props {
	project: UiProject;
}

export default
function Foo(props: Props) {
	const { project } = props;
	const [activeImage, setActiveImage] = useState(project.images[0]);

	return (
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
			<Typography paddingTop={2} component="div">
				<MarkdownContent plaintext>
					{project.description}
				</MarkdownContent>
			</Typography>
		</>
	);
}
