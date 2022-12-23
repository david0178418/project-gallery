
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSetAtom } from 'jotai';
import { loadingAtom, pushToastMsgAtom } from '@common/atoms';
import { useIsLoggedOut } from '@common/hooks';
import { CancelButton, ConfirmButton } from '@components/common/buttons';
import { inRange } from '@common/utils';
import { TextFieldLengthValidation } from '@components/common/text-field-length-validation';
import { CloseIcon } from '@components/icons';
import {
	useEffect,
	useState,
} from 'react';
import {
	MaxJournalPostLength,
	MaxProjectTitleLength,
	MinJournalPostLength,
	MinProjectTitleLength,
	ModalActions,
} from '@common/constants';
import { UiProject } from '@common/types/Project';
import { getProjects } from '@client/api-calls';
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

export
function CreateJournalModal() {
	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');
	const [projects, setProjects] = useState<UiProject[]>([]);
	const [selectedProjectId, setSelectedProjectId] = useState('');
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
	const isValid = (
		inRange(title.length, MinProjectTitleLength, MaxProjectTitleLength) &&
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
				setSelectedProjectId(res.data.projects[0]._id);
			}
		});
	}, [actionIsCreatePost, isLoggedOut]);

	async function handleSave() {
		try {
			setLoading(true);
			// Do Save Here
			close();
		} catch(e: any) {
			const { errors = ['Something went wrong. Try again.'] } = e;

			errors.map(pushToastMsg);
			console.log(e);
		}

		setLoading(false);
	}

	function close() {
		console.log(1111);
		setProjects([]);
		setSelectedProjectId('');
		setBody('');
		setTitle('');
		router.back();
	}

	if(!isOpen) {
		// TODO Figure out weird issue with background overlay persisting in
		// some instances. May be related to the "shallow" prop on NextJS Link
		return null;
	}

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
						maxLength={MaxProjectTitleLength}
						minLength={MinProjectTitleLength}
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
					onClick={handleSave}
					fullWidth={fullScreen}
					disabled={!isValid}
				/>
			</DialogActions>
		</Dialog>
	);
}
