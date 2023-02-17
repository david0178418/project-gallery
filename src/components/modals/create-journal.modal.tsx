
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSetAtom } from 'jotai';
import { loadingAtom, pushToastMsgAtom } from '@common/atoms';
import { useIsLoggedOut } from '@common/hooks';
import { CancelButton, ConfirmButton } from '@components/common/buttons';
import { CloseIcon, SaveIcon } from '@components/icons';
import EditJournalForm, { journalIsPublishable, journalIsValid } from '@components/forms/edit-journal.form';
import { WriteJournal } from '@common/types/Journal';
import { ModalActions } from '@common/constants';
import { useState } from 'react';
import { journalSave } from '@client/api-calls';
import {
	AppBar,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Toolbar,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material';

function createWriteJournal(): WriteJournal {
	return {
		body: '',
		title: '',
	};
}

export
function CreateJournalModal() {
	const [journal, setJournal] = useState(createWriteJournal);
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
	const canSave = journalIsValid(journal);
	const canPublish = journalIsPublishable(journal);

	async function handleSave(publish = false) {
		try {
			setLoading(true);

			await journalSave({
				...journal,
				publish,
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
		router.back();
		setJournal(createWriteJournal());
	}

	return (
		<Dialog
			fullWidth
			open={isOpen}
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
				<EditJournalForm
					journal={journal}
					onChange={setJournal}
				/>
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
					<CancelButton fullWidth={fullScreen} />
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
