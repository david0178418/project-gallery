import { useDropzone } from 'react-dropzone';
import { Box, Grid } from '@mui/material';
import {
	ImgHTMLAttributes,
	useCallback,
	useState,
} from 'react';

// async function uploadPhoto (file: File) {
// 	const res = await postFile(file);

// 	if (res.ok) {
// 		console.log('Uploaded successfully!');
// 	} else {
// 		console.error('Upload failed.');
// 	}
// }

interface Props {
	files: File[];
	onChange?(files: File[]): void;
}

export
function Uploader(props: Props) {
	const {
		files,
		onChange = () => {},
	} = props;

	// const [files, setFiles] = useState<File[]>([]);
	const onDrop = useCallback((acceptedFiles: File[]) => {
		onChange([...files, ...acceptedFiles]);
	}, [files]);

	const {
		getRootProps,
		getInputProps,
		isDragActive,
	} = useDropzone({
		onDrop,
		accept: { 'image/*': [] },
	});

	return (
		<>
			<Box
				{...getRootProps()}
				border="3px dashed"
				padding={1}
				borderRadius={2}
				borderColor={isDragActive ? 'Highlight' : 'InactiveBorder'}
				sx={{ cursor: 'pointer' }}
			>
				<input {...getInputProps()} />
				{
					isDragActive ?
						<p>Drop the files here ...</p> :
						<p>Drag n drop some files here, or click to select files</p>
				}
			</Box>
			<Grid
				rowGap={4}
				marginTop={2}
				container
			>
				{files.map(f => (
					<Grid
						item
						key={`${f.name}-${f.type}-${f.size}`}
						xs={2}
					>
						<FileImgPreview
							file={f}
							onClick={() => onChange(files.filter(f2 => f2 !== f))}
							style={{
								cursor: 'pointer',
								height: 100,
								width: 100,
							}}
						/>
					</Grid>
				))}
			</Grid>
		</>
	);
}

interface FooProps extends ImgHTMLAttributes<HTMLImageElement> {
	file: File;
}

function FileImgPreview(props: FooProps) {
	const {
		file,
		...imgProps
	} = props;

	const [objUrl] = useState(() => URL.createObjectURL(file));

	return (
		<img
			{...imgProps}
			src={objUrl}
			onLoad={() => {
				URL.revokeObjectURL(objUrl);
			}}
		/>
	);
}
