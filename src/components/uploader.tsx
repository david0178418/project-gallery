import { useDropzone } from 'react-dropzone';
import { Box } from '@mui/material';
import { postFile } from '@client/api-calls';
import { useSetAtom } from 'jotai';
import { loadingAtom } from '@common/atoms';
import { isTruthy } from '@common/utils';
import { Enum } from '@common/types';
import { FileUploadCategories } from '@common/constants';

async function uploadPhoto (file: File, category: Enum<typeof FileUploadCategories>) {
	const res = await postFile(file, category);

	if (res.ok) {
		return res.data.url;
	} else {
		return null;
	}
}

interface Props {
	category: Enum<typeof FileUploadCategories>;
	onAdd(files: string[]): void;
}

export
function Uploader(props: Props) {
	const setLoading = useSetAtom(loadingAtom);
	const {
		category,
		onAdd,
	} = props;

	async function onDrop (acceptedFiles: File[]) {
		setLoading(true);
		try {
			const results = await Promise.all(acceptedFiles.map(f => uploadPhoto(f, category)));
			onAdd(results.filter(isTruthy));
		} catch {
			// do something
		}

		setLoading(false);
	}

	const {
		getRootProps,
		getInputProps,
		isDragActive,
	} = useDropzone({
		onDrop,
		accept: { 'image/*': [] },
	});

	return (
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
	);
}
