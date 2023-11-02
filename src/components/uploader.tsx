import { useDropzone } from 'react-dropzone';
import { Box } from '@ui';
import { postFile } from '@client/api-calls';
import { useSetAtom } from 'jotai';
import { loadingAtom } from '@common/atoms';
import { isTruthy } from '@common/utils';
import { Enum } from '@common/types';
import { FileUploadCategories, SpecialCharacterCodes } from '@common/constants';
import { ComponentProps } from 'react';

async function uploadPhoto(file: File, category: Enum<typeof FileUploadCategories>) {
	const res = await postFile(file, category);

	if (res.ok) {
		return res.data.url;
	} else {
		return null;
	}
}

interface Props extends ComponentProps<typeof Box> {
	category: Enum<typeof FileUploadCategories>;
	onAdd(files: string[]): void;
}

export
function Uploader(props: Props) {
	const setLoading = useSetAtom(loadingAtom);
	const {
		category,
		onAdd,
		sx,
		children,
		...rest
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
			{...rest}
			borderColor={isDragActive ? 'Highlight' : 'InactiveBorder'}
			sx={{
				cursor: 'pointer',
				...sx,
			}}
		>
			<input {...getInputProps()} />
			{children || (
				isDragActive ?
					<p>Drop the files here ...</p> :
					<p>Drag n{SpecialCharacterCodes.RSQUO} drop some files here, or click to select files</p>
			)}
		</Box>
	);
}
