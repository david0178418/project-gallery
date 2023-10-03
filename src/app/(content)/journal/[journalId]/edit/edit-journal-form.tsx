'use client';
import { TextFieldLengthValidation } from '@components/common/text-field-length-validation';
import { UiProject } from '@common/types/Project';
import { inRange } from '@common/utils';
import { WriteJournal } from '@common/types/Journal';
import { useRouteBackDefault } from '@common/hooks';
import { CancelButton, ConfirmButton } from '@components/common/buttons';
import MarkdownContent from '@components/markdown-content';
import { usePushToastMsg, useSetLoading } from '@common/atoms';
import { SaveIcon } from '@components/icons';
import journalSaveAction from './journal-save-action';
import {
	useCallback,
	useState,
} from 'react';
import {
	MaxJournalPostLength,
	MaxJournalProjectTitleLength,
	MinJournalPostLength,
	MinJournalProjectTitleLength,
} from '@common/constants';
import {
	Box,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Tab,
	Tabs,
} from '@ui';

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
	const pushToastMsg = usePushToastMsg();
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
				result.errors?.map(pushToastMsg);
			} else {
				routeBack();
			}
		} catch(e: any) {
			const { errors = ['Something went wrong. Try again.'] } = e;

			errors.map(pushToastMsg);
			console.log(e);
		}

		setLoading(false);
	}

	return (
		<>
			<Box
				noValidate
				autoComplete="off"
				component="form"
			>
				<FormControl margin="dense">
					<InputLabel >Project</InputLabel>
					<Select
						label="Project"
						value={projectId || GeneralPost}
						onChange={e => handleSelectProjectId(e.target.value)}
						sx={{ minWidth: 200 }}
					>
						<MenuItem value={GeneralPost}>
							General Post
						</MenuItem>
						{projects.map(p => (
							<MenuItem
								key={p._id}
								value={p._id}
							>
								{p.title}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<TextFieldLengthValidation
					autoFocus
					fullWidth
					label="Title"
					variant="standard"
					margin="normal"
					type="text"
					maxLength={MaxJournalProjectTitleLength}
					minLength={MinJournalProjectTitleLength}
					value={title}
					onChange={e => handleChange({ title: e.target.value })}
				/>
				<Box paddingTop={2}>
					<Tabs value={showPreview.toString()}>
						<Tab value="false" label="Edit" onClick={() => setShowPreview(false) }/>
						<Tab value="true" label="Preview" onClick={() => setShowPreview(true) }/>
					</Tabs>
				</Box>
				{!showPreview && (
					<TextFieldLengthValidation
						fullWidth
						multiline
						margin="dense"
						label="Post"
						maxLength={MaxJournalPostLength}
						minLength={MinJournalPostLength}
						minRows={3}
						value={body}
						onChange={e => handleChange({ body: e.target.value })}
					/>
				)}
				{showPreview && (
					<MarkdownContent>
						{body}
					</MarkdownContent>
				)}
			</Box>
			<Box paddingTop={2} textAlign="right">
				<CancelButton />
				{!journal?.publish && (
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
							onClick={() => handleSave()}
							disabled={!journalIsValid(journal)}
							endIcon={<SaveIcon/>}
						>
							Save
						</ConfirmButton>
					</Box>
				)}
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
						onClick={() => handleSave(true)}
						disabled={!journalIsPublishable(journal)}
						variant="contained"
					>
						{journal?.publish ? 'Update' : 'Publish'}
					</ConfirmButton>
				</Box>
			</Box>
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
