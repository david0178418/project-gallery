import { TextFieldLengthValidation } from '@components/common/text-field-length-validation';
import { UiProject } from '@common/types/Project';
import dynamic from 'next/dynamic';
import { inRange } from '@common/utils';
import { WriteJournal } from '@common/types/Journal';
import { getProjects } from '@client/api-calls';
import { useIsLoggedOut } from '@common/hooks';
import {
	useCallback,
	useEffect,
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

const MarkdownContent = dynamic(() => import('@components/markdown-content'));

const GeneralPost = 'general-post';

interface Props {
	journal: WriteJournal;
	onChange(project: WriteJournal): void;
}

export default
function EditJournalForm(props: Props) {
	const {
		journal,
		onChange,
	} = props;
	const {
		body,
		title,
		projectId,
	} = journal;
	const [showPreview, setShowPreview] = useState(false);
	const [projects, setProjects] = useState<UiProject[]>([]);
	const isLoggedOut = useIsLoggedOut();

	const handleChange = useCallback((projectUpdates: Partial<WriteJournal>) => {
		onChange({
			...journal,
			...projectUpdates,
		});
	}, [title, body, projectId]);

	const handleSelectProjectId = useCallback((newProjectId: string) => {
		handleChange({ projectId: newProjectId === GeneralPost ? null : newProjectId });
	}, [handleChange]);

	useEffect(() => {
		if(isLoggedOut) {
			return;
		}

		getProjects().then(res => {
			if(res?.ok && res.data.projects.length) {
				setProjects(res.data.projects);
			}
		});
	}, [isLoggedOut]);

	return (
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
	);
}

export
function journalIsValid(journal: WriteJournal) {
	return (
		(journal.title.length < MaxJournalProjectTitleLength) &&
		(journal.body.length < MaxJournalPostLength)
	);
}

export
function journalIsPublishable(journal: WriteJournal) {
	return (
		inRange(journal.title.length, MinJournalProjectTitleLength, MaxJournalProjectTitleLength) &&
		inRange(journal.body.length, MinJournalPostLength, MaxJournalPostLength)
	);
}
