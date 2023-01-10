import { TextFieldLengthValidation } from '@components/common/text-field-length-validation';
import { Uploader } from '@components/uploader';
import { ProjectImage, WriteProject } from '@common/types/Project';
import { useCallback } from 'react';
import { inRange, swapItems } from '@common/utils';
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
	IconButton,
	TextField,
} from '@mui/material';
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	DeleteIcon,
} from '@components/icons';

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
				<Foo
					images={images}
					onLeftClick={handleMoveLeft}
					onRightClick={handleMoveRight}
					onDelete={handleRemoveFile}
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

interface FooProps {
	images: ProjectImage[];
	onDelete(file: ProjectImage): void;
	onLeftClick(imageIndex: number): void;
	onRightClick(imageIndex: number): void;
}

function Foo(props: FooProps) {
	const {
		images,
		onDelete,
		onLeftClick,
		onRightClick,
	} = props;

	return (
		<Grid
			container
			rowGap={4}
			marginTop={2}
			spacing={2}
		>
			{images.map((f, i) => (
				<Grid
					item
					key={f.url}
					xs={4}
				>
					<Box
						width="100%"
						position="relative"
						border="1px solid"
						overflow="hidden"
						padding={1}
						borderRadius={2}
						sx={{
							cursor: 'pointer',
							'& .actions': { sm: { display: 'none' } },
							'&:hover .actions': { display: 'block' },
						}}
					>
						<img
							src={f.url}
							width="100%"
							style={{ objectFit: 'contain' }}
						/>
						<Box className="actions">
							{!!i && (
								<Box
									position="absolute"
									left={0}
									bottom={0}
								>
									<IconButton onClick={() => onLeftClick(i)}>
										<ArrowLeftIcon/>
									</IconButton>
								</Box>
							)}
							{i !== (images.length - 1) && (
								<Box
									position="absolute"
									right={0}
									bottom={0}
								>
									<IconButton onClick={() => onRightClick(i)}>
										<ArrowRightIcon/>
									</IconButton>
								</Box>
							)}
							<Box
								position="absolute"
								right={0}
								top={0}
							>
								<IconButton onClick={() => onDelete(f)}>
									<DeleteIcon />
								</IconButton>
							</Box>
						</Box>
					</Box>
				</Grid>
			))}
		</Grid>
	);
}
