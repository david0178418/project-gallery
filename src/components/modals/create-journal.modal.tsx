
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSetAtom } from 'jotai';
import { loadingAtom, pushToastMsgAtom } from '@common/atoms';
import { useIsLoggedOut } from '@common/hooks';
import { CancelButton, ConfirmButton } from '@components/common/buttons';
import { inRange } from '@common/utils';
import { TextFieldLengthValidation } from '@components/common/text-field-length-validation';
import { CloseIcon, SaveIcon } from '@components/icons';
import {
	useEffect,
	useState,
} from 'react';
import {
	MaxJournalPostLength,
	MaxJournalProjectTitleLength,
	MinJournalPostLength,
	MinJournalProjectTitleLength,
	ModalActions,
} from '@common/constants';
import { UiProject } from '@common/types/Project';
import { getProjects, journalSave } from '@client/api-calls';
import {
	AppBar,
	Box,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	Toolbar,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material';

const GeneralPost = 'general-post';

export
function CreateJournalModal() {
	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');
	const [projects, setProjects] = useState<UiProject[]>([]);
	const [selectedProjectId, setSelectedProjectId] = useState(GeneralPost);
	const pushToastMsg = useSetAtom(pushToastMsgAtom);
	const setLoading = useSetAtom(loadingAtom);
	const isLoggedOut = useIsLoggedOut();
	const router = useRouter();
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const {
		a: action,
		...newQuery
	} = router.query;

	const actionIsCreatePost = action === ModalActions.CreateJournal;
	const isOpen = actionIsCreatePost && !isLoggedOut;
	const canSave = (
		(title.length < MaxJournalProjectTitleLength) &&
		(body.length < MaxJournalPostLength)
	);
	const canPublish = (
		inRange(title.length, MinJournalProjectTitleLength, MaxJournalProjectTitleLength) &&
		inRange(body.length, MinJournalPostLength, MaxJournalPostLength)
	);

	useEffect(() => {
		if(!actionIsCreatePost) {
			return;
		}

		if(isLoggedOut) {
			router.replace({
				pathname: router.pathname,
				query: newQuery,
			}, undefined, { shallow: true });

			return;
		}

		getProjects().then(res => {
			if(res?.data?.projects.length) {
				setProjects(res.data.projects);
			}
		});
	}, [actionIsCreatePost, isLoggedOut]);

	async function handleSave(publish = false) {
		try {
			setLoading(true);

			await journalSave({
				body,
				publish,
				title,
				projectId: selectedProjectId === GeneralPost ? null : selectedProjectId,
			});

			close();
		} catch(e: any) {
			const { errors = ['Something went wrong. Try again.'] } = e;

			errors.map(pushToastMsg);
			console.log(e);
		}

		setLoading(false);
	}

	function close() {
		setProjects([]);
		setSelectedProjectId(GeneralPost);
		setBody('');
		setTitle('');
		router.back();
	}

	if(!isOpen) {
		// TODO Figure out weird issue with background overlay persisting in
		// some instances. May be related to the "shallow" prop on NextJS Link
		return null;
	}

	console.log('selectedProjectId', selectedProjectId);

	return (
		<Dialog
			fullWidth
			open
			fullScreen={fullScreen}
			maxWidth="md"
		>
			{fullScreen && (
				<AppBar sx={{ position: 'relative' }}>
					<Toolbar>
						<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
							Create Journal Post
						</Typography>
						<IconButton
							edge="end"
							color="inherit"
							onClick={close}
						>
							<CloseIcon />
						</IconButton>
					</Toolbar>
				</AppBar>
			)}
			{!fullScreen && (
				<DialogTitle>
					Create Journal Post
				</DialogTitle>
			)}
			<DialogContent>
				<Box
					noValidate
					autoComplete="off"
					component="form"
				>
					<FormControl margin="dense">
						<InputLabel >Project</InputLabel>
						<Select
							label="Project"
							value={selectedProjectId}
							onChange={e => setSelectedProjectId(e.target.value)}
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
						onChange={e => setTitle(e.target.value)}
					/>
					<TextFieldLengthValidation
						fullWidth
						multiline
						margin="dense"
						label="Post"
						maxLength={MaxJournalPostLength}
						minLength={MinJournalPostLength}
						minRows={3}
						value={body}
						onChange={e => setBody(e.target.value)}
					/>
				</Box>
			</DialogContent>
			<DialogActions sx={{ gap: 2 }}>
				<Link
					replace
					shallow
					passHref
					legacyBehavior
					href={{
						pathname: router.pathname,
						query: newQuery,
					}}
				>
					<CancelButton fullWidth={fullScreen} onClick={close} />
				</Link>
				<ConfirmButton
					onClick={() => handleSave()}
					fullWidth={fullScreen}
					disabled={!canSave}
					endIcon={<SaveIcon/>}
				>
					Save
				</ConfirmButton>
				<ConfirmButton
					onClick={() => handleSave(true)}
					fullWidth={fullScreen}
					disabled={!canPublish}
					variant="contained"
				>
					Publish
				</ConfirmButton>
			</DialogActions>
		</Dialog>
	);
}
