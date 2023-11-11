'use client';
import { UiProject } from '@common/types/Project';
import { ImagePreviews } from '@components/image-previews';
import MarkdownContent from '@components/markdown-content';
import { useState } from 'react';

interface Props {
	project: UiProject;
}

export default
function ImageSelector(props: Props) {
	const { project } = props;
	const [activeImage, setActiveImage] = useState(project.images[0]);

	return (
		<>
			<div className="pt-2 text-center">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={activeImage?.url}
					className="max-w-full h-[400px] object-contain"
				/>
			</div>
			<ImagePreviews
				images={project.images}
				onClick={setActiveImage}
			/>
			<div className="pt-2">
				<MarkdownContent plaintext>
					{project.description}
				</MarkdownContent>
			</div>
		</>
	);
}
