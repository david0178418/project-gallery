'use client';
import { UiProject } from '@common/types/Project';
import { ImagePreviews } from '@components/image-previews';
import Box from '@mui/material/Box';
import { useState } from 'react';

interface Props {
	images: UiProject['images'];
}

export default
function ImageSelector(props: Props) {
	const { images } = props;
	const [activeImage, setActiveImage] = useState(images[0]);

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
				images={images}
				onClick={setActiveImage}
			/>
		</>
	);
}
