import { TextFieldLengthValidation } from '@components/common/text-field-length-validation';
import { Uploader } from '@components/uploader';
import { inRange, swapItems } from '@common/utils';
import ImageList from './image-list';
import LinksList from '@components/links-list';
import {
	useCallback,
	useState,
} from 'react';
import {
	ProjectImage,
	UiProject,
	WriteProject,
} from '@common/types/Project';
import {
	MaxJournalProjectTitleLength,
	MinJournalProjectTitleLength,
	FileUploadCategories,
	MinProjectDescriptionLength,
	MaxProjectDescriptionLength,
	MinLinkLabelSize,
	MaxLinkLabelSize,
} from '@common/constants';
import {
	Box,
	Button,
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
		links,
	} = project;
	const [selectedTab, setSelectedTab] = useState(0);
	const handleChange = useCallback((projectUpdates: Partial<WriteProject>) => {
		onChange({
			...project,
			...projectUpdates,
		});
	}, [project]);

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
		handleChange({ images: swapItems(images, index, index - 1) });
	}, [handleChange, images]);
	const handleMoveRight = useCallback((index: number) => {
		handleChange({ images: swapItems(images, index, index + 1) });
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
		links,
		title,
	} = project;

	return !!images.length &&
		links.every(linkIsValid) &&
		inRange(title.length, MinJournalProjectTitleLength, MaxJournalProjectTitleLength) &&
		inRange(description.length, MinProjectDescriptionLength, MaxProjectDescriptionLength);
}

type ProjectLink = UiProject['links'][number];

function linkIsValid(link: ProjectLink) {
	return inRange(link.label.length, MinLinkLabelSize, MaxLinkLabelSize);
}

interface LinkProps {
	onAdd(label: string, url: string): void;
}

function LinkForm(props: LinkProps) {
	const [label, setLabel] = useState('');
	const [url, setUrl] = useState('');
	const { onAdd } = props;

	return (
		<>
			<Grid container columnGap={1}>
				<Grid item>
					<TextFieldLengthValidation
						fullWidth
						margin="dense"
						label="Label"
						value={label}
						onChange={e => setLabel(e.target.value)}
					/>
				</Grid>
				<Grid item>
					<TextFieldLengthValidation
						fullWidth
						margin="dense"
						label="Url"
						value={url}
						onChange={e => setUrl(e.target.value)}
					/>
				</Grid>
			</Grid>
			<Button
				disabled={!linkIsValid({
					label,
					url,
				})}
				onClick={() => onAdd(label, url)}
			>
				Add Link
			</Button>
		</>
	);
}
