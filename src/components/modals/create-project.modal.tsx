
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
	useRef,
	useState,
} from 'react';
import {
	MaxProjectSummaryLength,
	MaxProjectTitleLength,
	MinProjectSummaryLength,
	MinProjectTitleLength,
	ModalActions,
} from '@common/constants';
import {
	AppBar,
	Box,
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

export
function CreateProjectModal() {
	const pushToastMsg = useSetAtom(pushToastMsgAtom);
	const setLoading = useSetAtom(loadingAtom);
	const isLoggedOut = useIsLoggedOut();
	const router = useRouter();
	const [title, setTitle] = useState('');
	const [summary, setSummary] = useState('');
	const [detail, setDetail] = useState('');
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const abortControllerRef = useRef<AbortController | null>(null);
	const {
		a: action,
		...newQuery
	} = router.query;

	const actionIsCreatePost = action === ModalActions.CreateProject;
	const isOpen = actionIsCreatePost && !isLoggedOut;
	const isValid = (
		inRange(summary.length, MinProjectSummaryLength, MaxProjectSummaryLength) &&
		inRange(title.length, MinProjectTitleLength, MaxProjectTitleLength)
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
		}
	}, [actionIsCreatePost, isLoggedOut]);

	useEffect(() => {
		if(!abortControllerRef.current) {
			return;
		}

		abortControllerRef.current.abort();

		abortControllerRef.current = null;
	}, [summary]);
	// END Clean this mess up

	async function handleSave() {
		try {
			setLoading(true);
			// await postSave({
			// 	title,
			// 	body,
			// 	points,
			// 	nsfl,
			// 	nsfw,
			// }));
			close();
		} catch(e: any) {
			const { errors = ['Something went wrong. Try again.'] } = e;

			errors.map(pushToastMsg);
			console.log(e);
		}

		setLoading(false);
	}

	function close() {
		setSummary('');
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
							Create Project
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
					Create Project
				</DialogTitle>
			)}
			<DialogContent>
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
						maxLength={MaxProjectTitleLength}
						minLength={MinProjectSummaryLength}
						value={title}
						onChange={e => setTitle(e.target.value)}
					/>
					<TextFieldLengthValidation
						fullWidth
						multiline
						margin="dense"
						label="Project Summy"
						variant="standard"
						placeholder="Short project summary..."
						type="text"
						maxLength={MaxProjectSummaryLength}
						minLength={MinProjectSummaryLength}
						minRows={3}
						value={summary}
						onChange={e => setSummary(e.target.value)}
					/>
					<TextFieldLengthValidation
						fullWidth
						multiline
						margin="dense"
						label="Project Detail"
						placeholder="General project details..."
						maxLength={MaxProjectSummaryLength}
						minLength={MinProjectSummaryLength}
						minRows={3}
						value={detail}
						onChange={e => setDetail(e.target.value)}
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
					<CancelButton fullWidth={fullScreen} />
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
