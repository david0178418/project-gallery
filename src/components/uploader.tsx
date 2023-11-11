import { HTMLAttributes } from 'react';
import { useDropzone } from 'react-dropzone';
import { postFile } from '@client/api-calls';
import { useSetAtom } from 'jotai';
import { loadingAtom } from '@common/atoms';
import { isTruthy } from '@common/utils';
import { Enum } from '@common/types';
import { cn } from '@/lib/utils';
import { FileUploadCategories, SpecialCharacterCodes } from '@common/constants';

async function uploadPhoto(file: File, category: Enum<typeof FileUploadCategories>) {
	const res = await postFile(file, category);

	if (res.ok) {
		return res.data.url;
	} else {
		return null;
	}
}

interface Props extends HTMLAttributes<HTMLDivElement> {
	category: Enum<typeof FileUploadCategories>;
	onAdd(files: string[]): void;
}

export
function Uploader(props: Props) {
	const setLoading = useSetAtom(loadingAtom);
	const {
		category,
		onAdd,
		children,
		className,
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
		<div
			{...getRootProps()}
			{...rest}
			className={cn(className, 'cursor-pointer', {
				Highlight: isDragActive,
				InactiveBorder: !isDragActive,
			})}
		>
			<input {...getInputProps()} />
			{children || (
				isDragActive ?
					<p>Drop the files here ...</p> :
					<p>Drag n{SpecialCharacterCodes.RSQUO} drop some files here, or click to select files</p>
			)}
		</div>
	);
}
