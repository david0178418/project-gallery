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
import saveProjectAction from './save-project-action';
import { useRouteBackDefault } from '@common/hooks';
import { SaveIcon } from '@components/icons';
import { Checkbox } from '@/components/ui/checkbox';
import TextField from '@components/common/text-field';
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
	Tabs,
	TabsList,
	TabsTrigger,
} from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useSetLoading } from '@components/loader';

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
	const [selectedTab, setSelectedTab] = useState('description');
	const setLoading = useSetLoading();
	const routeBack = useRouteBackDefault();
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

		setLoading(true);

		try {
			const result = await saveProjectAction(project);

			if(!result.ok) {
				result.errors?.map(msg => toast(msg));
			} else {
				toast(`"${project.title}" saved`);
				routeBack();
			}
		} catch(e: any) {
			const { errors = ['Something went wrong. Try again.'] } = e;

			errors.map((msg: string) => toast(msg));
			console.log(e);
		}

		setLoading(false);
	}, [project]);

	return (
		<>
			<form noValidate autoComplete="off">
				<TextFieldLengthValidation
					className="w-full"
					autoFocus
					label="Title"
					placeholder="Project title"
					type="text"
					maxLength={MaxJournalProjectTitleLength}
					minLength={MinJournalProjectTitleLength}
					value={title}
					onChange={e => handleChange({ title: e.target.value })}
				/>
				<div className="grid col-span-12">
					<div>
						<TextField
							label="Created"
							type="date"
							value={dateToDateSubstring(new Date(projectCreatedDate))}
							onChange={e => handleChange({ projectCreatedDate: dateInputStrToDate(e.target.value).toISOString() })}
						/>
					</div>
					<div>
						<TextField
							label="Last Updated"
							type="date"
							value={dateToDateSubstring(new Date(projectLastUpdatedDate))}
							onChange={e => handleChange({ projectLastUpdatedDate: dateInputStrToDate(e.target.value).toISOString() })}
						/>
					</div>
				</div>
				<div className="pt-1">
					<LabelForm onAdd={handleAddLabel} />
				</div>
				{!!labels.length && (
					<div className="pt-1">
						{labels.map((l, i) => (
							<Label
								key={l.label}
								label={l.label}
								onDelete={() => handleRemoveLabel(i)}
							/>
						))}
					</div>
				)}
				<div className="pt-1">
					{/** TODO Fix the tab nonsense */}
					<Tabs value={selectedTab}>
						<TabsList>
							<TabsTrigger
								value="description"
								onClick={() => setSelectedTab('description') }
							>
								Description
							</TabsTrigger>
							<TabsTrigger
								value="images"
								onClick={() => setSelectedTab('images') }
							>
								Images
							</TabsTrigger>
							<TabsTrigger
								value="links"
								onClick={() => setSelectedTab('links') }
							>
								Links
							</TabsTrigger>
						</TabsList>
					</Tabs>
					<div className="pt-1">
						{selectedTab === 'description' && (
							<TextFieldLengthValidation
								className="w-full"
								multiline
								label="Description"
								placeholder="General project description..."
								maxLength={MaxProjectDescriptionLength}
								minLength={MinProjectDescriptionLength}
								value={description}
								onChange={e => handleChange({ description: e.target.value })}
							/>
						)}
						{selectedTab === 'images' && (
							<>
								<Uploader
									className="border-4 border-dashed p-1 rounded-lg"
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
						{selectedTab === 'links' && (
							<>
								<LinkForm onAdd={handleAddLink}/>
								<div className="pt-1">
									<LinksList onRemove={handleRemoveLink} links={links} />
								</div>
							</>
						)}
					</div>
				</div>
				<div className="pt-1 flex items-center space-x-2">
					<Checkbox
						id="unlisted"
						checked={unlisted}
						onCheckedChange={(checked) => handleChange({ unlisted: !!checked })}
					/>
					<label
						htmlFor="unlisted"
						className="text-sm font-medium cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						Unlisted
					</label>
				</div>
			</form>
			<div className="pt-2 text-right">
				<CancelButton />
				<div className="block md:inline-block md:pl-2 pt-2 md:pt-0 pb-20">
					<ConfirmButton
						onClick={handleSave}
						disabled={!(project && projectIsValid(project))}
						icon={<SaveIcon/>}
					/>
				</div>
			</div>
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
