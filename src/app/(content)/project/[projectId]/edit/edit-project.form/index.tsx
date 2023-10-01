'use client';
import { TextFieldLengthValidation } from '@components/common/text-field-length-validation';
import { Uploader } from '@components/uploader';
import ImageList from './image-list';
import LinksList from '@components/links-list';
import LinkForm, { linkIsValid } from './link-form';
import LabelForm, { labelIsValid } from './label-form';
import { useCallback, useState } from 'react';
import { ProjectImage, WriteProject } from '@common/types/Project';
import Label from '@components/label';
import { CancelButton, ConfirmButton } from '@components/common/buttons';
import { usePushToastMsg, useSetLoading } from '@common/atoms';
import saveProject from './save-project-action';
import { useRouteBackDefault } from '@common/hooks';
import {
	inRange,
	moveItemLeft,
	moveItemRight,
} from '@common/utils';
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
	Checkbox,
	FormControlLabel,
	Grid,
	Tab,
	Tabs,
	TextField,
} from '@ui';

function dateToDateSubstring(date: Date) {
	return date.toISOString().substring(0, 10);
}

function dateInputStrToDate(str: string) {
	return new Date(str.replaceAll('-', '/'));
}

interface Props {
	project: WriteProject;
}

export default
function EditProjectForm(props: Props) {
	const { project: rawProject } = props;
	const [project, setProject] = useState(rawProject);
	const {
		images,
		projectCreatedDate,
		projectLastUpdatedDate,
		title,
		description,
		labels,
		links,
		unlisted = false,
	} = project;
	const [selectedTab, setSelectedTab] = useState(0);
	const setLoading = useSetLoading();
	const routeBack = useRouteBackDefault();
	const pushToastMsg = usePushToastMsg();
	const handleChange = useCallback((projectUpdates: Partial<WriteProject>) => {
		setProject({
			...project,
			...projectUpdates,
		});
	}, [project]);

	const handleAddLabel = useCallback((label: string) => {
		handleChange({
			labels: [
				{ label },
				...labels,
			].sort(comparLabel),
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

	const handleSave = useCallback(async () => {
		if(!project) {
			return;
		}

		try {
			setLoading(true);
			await saveProject({ project });
			routeBack();
		} catch(e: any) {
			const { errors = ['Something went wrong. Try again.'] } = e;

			errors.map(pushToastMsg);
			console.log(e);
		}

		setLoading(false);
	}, [project]);

	return (
		<>
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
							<Label
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
				<Box paddingTop={1}>
					<FormControlLabel
						label="Unlisted"
						control={
							<Checkbox
								checked={unlisted}
								onChange={(e, checked) => handleChange({ unlisted: checked })}
							/>
						}
					/>
				</Box>
			</Box>
			<Box paddingTop={2} textAlign="right">
				<CancelButton />
				<Box
					sx={{
						display: {
							xs: 'block',
							md: 'inline-block',
						},
						paddingLeft: { md: 2 },
						paddingTop: {
							xs: 2,
							md: 0,
						},
						paddingBottom: 20,
					}}
				>
					<ConfirmButton
						onClick={handleSave}
						disabled={!(project && projectIsValid(project))}
					/>
				</Box>
			</Box>
		</>
	);
}

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

type Label = WriteProject['labels'][number];

function comparLabel(a: Label, b: Label) {
	return a.label.localeCompare(b.label);
}