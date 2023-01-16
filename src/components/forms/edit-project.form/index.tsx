import { TextFieldLengthValidation } from '@components/common/text-field-length-validation';
import { Uploader } from '@components/uploader';
import { ProjectImage, WriteProject } from '@common/types/Project';
import { useCallback } from 'react';
import { inRange, swapItems } from '@common/utils';
import ImageList from './image-list';
import {
	MaxJournalProjectTitleLength,
	MinJournalProjectTitleLength,
	FileUploadCategories,
	MinProjectDescriptionLength,
	MaxProjectDescriptionLength,
} from '@common/constants';
import {
	Box,
	Grid,
	TextField,
} from '@mui/material';

function dateToDateSubstring(date: Date) {
	return date.toISOString().substring(0, 10);
}

function dateInputStrToDate(str: string) {
	return new Date(str.replaceAll('-', '/'));
}

interface Props {
	project: WriteProject;
	onChange(project: WriteProject): void;
}

export default
function EditProjectForm(props: Props) {
	const {
		project,
		onChange,
	} = props;
	const {
		images,
		projectCreatedDate,
		projectLastUpdatedDate,
		title,
		description,
	} = project;
	const handleChange = useCallback((projectUpdates: Partial<WriteProject>) => {
		onChange({
			...project,
			...projectUpdates,
		});
	}, [
		images,
		projectCreatedDate,
		projectLastUpdatedDate,
		title,
		description,
	]);

	const handleAddFiles = useCallback((newImageUrls: string[]) => {
		const newImages = newImageUrls.map(url => ({
			url,
			description: '',
		}));
		handleChange({ images: [...images, ...newImages] });
	}, [images]);
	const handleRemoveFile = useCallback((img: ProjectImage) => {
		handleChange({ images: images.filter(f => f.url !== img.url) });
	}, [images]);
	const handleMoveLeft = useCallback((index: number) => {
		handleChange({ images: swapItems(images, index, index - 1) });
	}, [images]);
	const handleMoveRight = useCallback((index: number) => {
		handleChange({ images: swapItems(images, index, index + 1) });
	}, [images]);

	return (
		<Box
			noValidate
			autoComplete="off"
			component="form"
		>
			<TextFieldLengthValidation
				autoFocus
				fullWidth
				label="Title"
				variant="standard"
				placeholder="Project title"
				type="text"
				maxLength={MaxJournalProjectTitleLength}
				minLength={MinJournalProjectTitleLength}
				value={title}
				onChange={e => handleChange({ title: e.target.value })}
			/>
			<Grid container>
				<Grid item xs>
					<TextField
						label="Created"
						type="date"
						variant="standard"
						margin="dense"
						value={dateToDateSubstring(new Date(projectCreatedDate))}
						onChange={e => handleChange({ projectCreatedDate: dateInputStrToDate(e.target.value).toISOString() })}
					/>
				</Grid>
				<Grid item xs>
					<TextField
						label="Last Updated"
						type="date"
						variant="standard"
						margin="dense"
						value={dateToDateSubstring(new Date(projectLastUpdatedDate))}
						onChange={e => handleChange({ projectLastUpdatedDate: dateInputStrToDate(e.target.value).toISOString() })}
					/>
				</Grid>
			</Grid>
			<Box paddingTop={1}>
				<Uploader
					category={FileUploadCategories.Posts}
					onAdd={handleAddFiles}
				/>
				<ImageList
					images={images}
					onLeftClick={handleMoveLeft}
					onRightClick={handleMoveRight}
					onDelete={handleRemoveFile}
				/>
				<TextFieldLengthValidation
					fullWidth
					multiline
					margin="dense"
					label="Description"
					placeholder="General project description..."
					maxLength={MaxProjectDescriptionLength}
					minLength={MinProjectDescriptionLength}
					minRows={3}
					value={description}
					onChange={e => handleChange({ description: e.target.value })}
				/>
			</Box>
		</Box>
	);
}

export
function projectIsValid(project: WriteProject) {
	const {
		title,
		description,
		images,
	} = project;

	return !!images.length &&
		inRange(title.length, MinJournalProjectTitleLength, MaxJournalProjectTitleLength) &&
		inRange(description.length, MinProjectDescriptionLength, MaxProjectDescriptionLength);
}
