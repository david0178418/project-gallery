import { TextFieldLengthValidation } from '@components/common/text-field-length-validation';
import { Uploader } from '@components/uploader';
import { ImagePreviews } from '@components/image-previews';
import { ProjectImage, WriteProject } from '@common/types/Project';
import { useCallback } from 'react';
import {
	MaxProjectSummaryLength,
	MaxJournalProjectTitleLength,
	MinProjectSummaryLength,
	MinJournalProjectTitleLength,
	FileUploadCategories,
	MinProjectDetailLength,
	MaxProjectDetailLength,
} from '@common/constants';
import {
	Box,
	Grid,
	TextField,
} from '@mui/material';
import { inRange } from '@common/utils';

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
		summary,
		detail,
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
		summary,
		detail,
	]);
	// const [files, setFiles] = useState<Array<File | string>>([]);
	// const [projectCreatedDate, setProjectCreatedDate] = useState(() => new Date());
	// const [projectLastUpdatedDate, setProjectLastUpdatedDate] = useState(() => new Date());
	// const [title, setTitle] = useState('');
	// const [summary, setSummary] = useState('');
	// const [detail, setDetail] = useState('');

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
				<ImagePreviews
					images={images}
					onClick={handleRemoveFile}
				/>
			</Box>
			<TextFieldLengthValidation
				fullWidth
				multiline
				margin="dense"
				label="Project Summary"
				variant="standard"
				placeholder="Short project summary..."
				type="text"
				maxLength={MaxProjectSummaryLength}
				minLength={MinProjectSummaryLength}
				minRows={3}
				value={summary}
				onChange={e => handleChange({ summary: e.target.value })}
			/>
			<TextFieldLengthValidation
				fullWidth
				multiline
				margin="dense"
				label="Project Detail"
				placeholder="General project details..."
				maxLength={MaxProjectSummaryLength}
				minLength={MinProjectSummaryLength}
				minRows={3}
				value={detail}
				onChange={e => handleChange({ detail: e.target.value })}
			/>
		</Box>
	);
}

export
function projectIsValid(project: WriteProject) {
	const {
		title,
		summary,
		detail,
		images,
	} = project;

	return !!images.length &&
		inRange(title.length, MinJournalProjectTitleLength, MaxJournalProjectTitleLength) &&
		inRange(summary.length, MinProjectSummaryLength, MaxProjectSummaryLength) &&
		inRange(detail.length, MinProjectDetailLength, MaxProjectDetailLength);
}
