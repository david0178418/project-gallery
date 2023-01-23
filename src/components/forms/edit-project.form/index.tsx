import { TextFieldLengthValidation } from '@components/common/text-field-length-validation';
import { Uploader } from '@components/uploader';
import ImageList from './image-list';
import LinksList from '@components/links-list';
import LinkForm, { linkIsValid } from './link-form';
import LabelForm, { labelIsValid } from './label-form';
import {
	inRange,
	moveItemLeft,
	moveItemRight,
} from '@common/utils';
import {
	useCallback,
	useState,
} from 'react';
import {
	ProjectImage,
	WriteProject,
} from '@common/types/Project';
import {
	MaxJournalProjectTitleLength,
	MinJournalProjectTitleLength,
	FileUploadCategories,
	MinProjectDescriptionLength,
	MaxProjectDescriptionLength,
	maxLabelCount,
} from '@common/constants';
import {
	Box,
	Chip,
	Grid,
	Tab,
	Tabs,
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
		labels,
		links,
	} = project;
	const [selectedTab, setSelectedTab] = useState(0);
	const handleChange = useCallback((projectUpdates: Partial<WriteProject>) => {
		onChange({
			...project,
			...projectUpdates,
		});
	}, [project]);

	const handleAddLabel = useCallback((label: string) => {
		handleChange({
			labels: [
				{ label },
				...labels,
			],
		});
	}, [handleChange, labels]);
	const handleRemoveLabel = useCallback((labelIndex: number) => {
		handleChange({ labels: labels.filter((l, i) => i !== labelIndex) });
	}, [handleChange, labels]);
	const handleAddLink = useCallback((label: string, url: string) => {
		handleChange({
			links: [
				{
					label,
					url,
				},
				...links,
			],
		});
	}, [handleChange, links]);
	const handleRemoveLink = useCallback((linkIndex: number) => {
		handleChange({ links: links.filter((l, i) => i !== linkIndex) });
	}, [handleChange, links]);
	const handleAddFiles = useCallback((newImageUrls: string[]) => {
		const newImages = newImageUrls.map(url => ({
			url,
			description: '',
		}));
		handleChange({ images: [...images, ...newImages] });
	}, [handleChange, images]);
	const handleRemoveFile = useCallback((img: ProjectImage) => {
		handleChange({ images: images.filter(f => f.url !== img.url) });
	}, [handleChange, images]);
	const handleMoveLeft = useCallback((index: number) => {
		handleChange({ images: moveItemLeft(images, index) });
	}, [handleChange, images]);
	const handleMoveRight = useCallback((index: number) => {
		handleChange({ images: moveItemRight(images, index) });
	}, [handleChange, images]);

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
				<LabelForm onAdd={handleAddLabel} />
			</Box>
			{!!labels.length && (
				<Box paddingTop={1}>
					{labels.map((l, i) => (
						<Chip
							key={l.label}
							label={l.label}
							onDelete={() => handleRemoveLabel(i)}
						/>
					))}
				</Box>
			)}
			<Box paddingTop={1}>
				<Tabs value={selectedTab} onChange={(e, val) => setSelectedTab(val)}>
					<Tab label="Description" />
					<Tab label="Images"/>
					<Tab label="Links" />
				</Tabs>
				<Box paddingTop={1}>
					{selectedTab === 0 && (
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
					)}
					{selectedTab === 1 && (
						<>
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
						</>
					)}
					{selectedTab === 2 && (
						<>
							<LinkForm onAdd={handleAddLink}/>
							<Box paddingTop={1}>
								<LinksList onRemove={handleRemoveLink} links={links} />
							</Box>
						</>
					)}
				</Box>
			</Box>
		</Box>
	);
}

export
function projectIsValid(project: WriteProject) {
	const {
		description,
		images,
		labels,
		links,
		title,
	} = project;

	return !!images.length &&
		links.every(linkIsValid) &&
		(labels.length <= maxLabelCount) &&
		labels.every(labelIsValid) &&
		inRange(title.length, MinJournalProjectTitleLength, MaxJournalProjectTitleLength) &&
		inRange(description.length, MinProjectDescriptionLength, MaxProjectDescriptionLength);
}
