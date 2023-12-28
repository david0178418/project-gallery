'use client';
import { TextFieldLengthValidation } from '@components/common/text-field-length-validation';
import { UiProject } from '@common/types/Project';
import { inRange } from '@common/utils';
import { WriteJournal } from '@common/types/Journal';
import { useRouteBackDefault } from '@common/hooks';
import { CancelButton, ConfirmButton } from '@components/common/buttons';
import MarkdownContent from '@components/markdown-content';
import { SaveIcon } from '@components/icons';
import journalSaveAction from './journal-save-action';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useSetLoading } from '@components/loader';
import {
	MaxJournalPostLength,
	MaxJournalProjectTitleLength,
	MinJournalPostLength,
	MinJournalProjectTitleLength,
} from '@common/constants';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectGroup,
	SelectItem,
} from '@components/ui/select';
import {
	Tabs,
	TabsList,
	TabsTrigger,
} from '@/components/ui/tabs';

const GeneralPost = 'general-post';

interface Props {
	journal: WriteJournal;
	projects: UiProject[];
}

export default
function EditJournalForm(props: Props) {
	const {
		journal: rawJournal,
		projects,
	} = props;
	const [journal, setJournal] = useState(rawJournal);
	const {
		body,
		title,
		projectId,
	} = journal;
	const setLoading = useSetLoading();
	const routeBack = useRouteBackDefault();
	const [showPreview, setShowPreview] = useState(false);

	const handleChange = useCallback((projectUpdates: Partial<WriteJournal>) => {
		setJournal({
			...journal,
			...projectUpdates,
		});
	}, [journal]);

	const handleSelectProjectId = useCallback((newProjectId: string) => {
		handleChange({ projectId: newProjectId === GeneralPost ? null : newProjectId });
	}, [handleChange]);

	async function handleSave(publish = false) {
		if(!journal) {
			return;
		}

		setLoading(true);

		try {
			const result = await journalSaveAction({
				...journal,
				publish: journal.publish || publish,
			});

			if(!result.ok) {
				result.errors?.map(msg => toast(msg));
			} else {
				toast(`"${journal.title}" ${publish ? 'published' : 'saved'}`);
				routeBack();
			}
		} catch(e: any) {
			const { errors = ['Something went wrong. Try again.'] } = e;

			errors.map((msg: string) => toast(msg));
			console.log(e);
		}

		setLoading(false);
	}

	return (
		<>
			<form noValidate autoComplete="off">
				<Select value={projectId || GeneralPost} onValueChange={handleSelectProjectId}>
					<SelectTrigger className="w-[180px]">
						<SelectValue>
							{projectId || GeneralPost}
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{projects.map(p => (
								<SelectItem
									key={p._id}
									value={p._id}
								>
									{p.title}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
				<TextFieldLengthValidation
					autoFocus
					className="w-full"
					label="Title"
					type="text"
					maxLength={MaxJournalProjectTitleLength}
					minLength={MinJournalProjectTitleLength}
					value={title}
					onChange={e => handleChange({ title: e.target.value })}
				/>
				<div className="pt=2">
					<Tabs value={showPreview.toString()}>
						<TabsList>
							<TabsTrigger
								value="false"
								onClick={() => setShowPreview(false) }
							>
								Edit
							</TabsTrigger>
							<TabsTrigger
								value="true"
								onClick={() => setShowPreview(true) }
							>
								Preview
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>
				{!showPreview && (
					<TextFieldLengthValidation
						multiline
						className="w-full min-h-10"
						label="Post"
						value={body}
						maxLength={MaxJournalPostLength}
						minLength={MinJournalPostLength}
						onChange={e => handleChange({ body: e.target.value })}
					/>
				)}
				{showPreview && (
					<MarkdownContent>
						{body}
					</MarkdownContent>
				)}
			</form>
			<div className="pt-2 text-right">
				<CancelButton />
				{!journal?.publish && (
					<div
						className="block md:inline-block md:pl-2 pt-2 md:pt-0 pb-20"
					>
						<ConfirmButton
							onClick={() => handleSave()}
							disabled={!journalIsValid(journal)}
							icon={<SaveIcon/>}
						>
							Save
						</ConfirmButton>
					</div>
				)}
				<div className="block md:inline-block md:pl-2 pt-2 md:pt-0 pb-20">
					<ConfirmButton
						onClick={() => handleSave(true)}
						disabled={!journalIsPublishable(journal)}
					>
						{journal?.publish ? 'Update' : 'Publish'}
					</ConfirmButton>
				</div>
			</div>
		</>
	);
}

function journalIsValid(journal: WriteJournal) {
	return (
		(journal.title.length < MaxJournalProjectTitleLength) &&
		(journal.body.length < MaxJournalPostLength)
	);
}

function journalIsPublishable(journal: WriteJournal) {
	return (
		inRange(journal.title.length, MinJournalProjectTitleLength, MaxJournalProjectTitleLength) &&
		inRange(journal.body.length, MinJournalPostLength, MaxJournalPostLength)
	);
}
