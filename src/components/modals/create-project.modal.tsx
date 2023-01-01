
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSetAtom } from 'jotai';
import { loadingAtom, pushToastMsgAtom } from '@common/atoms';
import { useIsLoggedOut } from '@common/hooks';
import { CancelButton, ConfirmButton } from '@components/common/buttons';
import { inRange } from '@common/utils';
import { TextFieldLengthValidation } from '@components/common/text-field-length-validation';
import { CloseIcon } from '@components/icons';
import { projectSave } from '@client/api-calls';
import { Uploader } from '@components/uploader';
import {
	useEffect,
	useState,
} from 'react';
import {
	MaxProjectDetailLength,
	MaxProjectSummaryLength,
	MaxJournalProjectTitleLength,
	MinProjectDetailLength,
	MinProjectSummaryLength,
	MinJournalProjectTitleLength,
	ModalActions,
} from '@common/constants';
import {
	AppBar,
	Box,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton,
	TextField,
	Toolbar,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material';

function dateToDateSubstring(date: Date) {
	return date.toISOString().substring(0, 10);
}

function dateInputStrToDate(str: string) {
	return new Date(str.replaceAll('-', '/'));
}

export
function CreateProjectModal() {
	const [files, setFiles] = useState<File[]>([]);
	const [projectCreatedDate, setProjectCreatedDate] = useState(() => new Date());
	const [projectLastUpdatedDate, setProjectLastUpdatedDate] = useState(() => new Date());
	const [title, setTitle] = useState('');
	const [summary, setSummary] = useState('');
	const [detail, setDetail] = useState('');
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

	const actionIsCreatePost = action === ModalActions.CreateProject;
	const isOpen = actionIsCreatePost && !isLoggedOut;
	const isValid = (
		inRange(title.length, MinJournalProjectTitleLength, MaxJournalProjectTitleLength) &&
		inRange(summary.length, MinProjectSummaryLength, MaxProjectSummaryLength) &&
		inRange(detail.length, MinProjectDetailLength, MaxProjectDetailLength)
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

	async function handleSave() {
		try {
			setLoading(true);
			await projectSave({
				title,
				summary,
				detail,
				projectCreatedDate: projectCreatedDate.toISOString(),
				projectLastUpdatedDate: projectLastUpdatedDate.toISOString(),
				images: [],
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
		setProjectCreatedDate(() => new Date());
		setProjectLastUpdatedDate(() => new Date());
		setDetail('');
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
						maxLength={MaxJournalProjectTitleLength}
						minLength={MinJournalProjectTitleLength}
						value={title}
						onChange={e => setTitle(e.target.value)}
					/>
					<Grid container>
						<Grid item xs>
							<TextField
								label="Created"
								type="date"
								variant="standard"
								margin="dense"
								value={dateToDateSubstring(projectCreatedDate)}
								onChange={e => setProjectCreatedDate(dateInputStrToDate(e.target.value))}
							/>
						</Grid>
						<Grid item xs>
							<TextField
								label="Last Updated"
								type="date"
								variant="standard"
								margin="dense"
								value={dateToDateSubstring(projectLastUpdatedDate)}
								onChange={e => setProjectLastUpdatedDate(dateInputStrToDate(e.target.value))}
							/>
						</Grid>
					</Grid>
					<Box paddingTop={1}>
						<Uploader
							files={files}
							onChange={fs => setFiles(fs)}
						/>
					</Box>
					<TextFieldLengthValidation
						fullWidth
						multiline
						margin="dense"
						label="Project Summary"
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
