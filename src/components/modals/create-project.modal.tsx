
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSetAtom } from 'jotai';
import { loadingAtom, pushToastMsgAtom } from '@common/atoms';
import { useIsLoggedOut } from '@common/hooks';
import { CancelButton, ConfirmButton } from '@components/common/buttons';
import { inRange, nowISOString } from '@common/utils';
import { CloseIcon } from '@components/icons';
import { projectSave } from '@client/api-calls';
import { CreateProjectForm } from '@components/forms/create-project.form';
import { useEffect, useState } from 'react';
import { WriteProject } from '@common/types/Project';
import {
	MaxJournalProjectTitleLength,
	MaxProjectDetailLength,
	MaxProjectSummaryLength,
	MinJournalProjectTitleLength,
	MinProjectDetailLength,
	MinProjectSummaryLength,
	ModalActions,
} from '@common/constants';
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

function projectIsValid(project: WriteProject) {
	const {
		title,
		summary,
		detail,
	} = project;

	return inRange(title.length, MinJournalProjectTitleLength, MaxJournalProjectTitleLength) &&
		inRange(summary.length, MinProjectSummaryLength, MaxProjectSummaryLength) &&
		inRange(detail.length, MinProjectDetailLength, MaxProjectDetailLength);
}

function createWriteProject(): WriteProject {
	return {
		detail: '',
		projectCreatedDate: nowISOString(),
		projectLastUpdatedDate: nowISOString(),
		summary: '',
		title: '',
		images: [],
	};
}

export
function CreateProjectModal() {
	const [project, setProject] = useState(createWriteProject);
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
	const isValid = projectIsValid(project);

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
			await projectSave(project);
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
				<CreateProjectForm
					project={project}
					onChange={newProj => setProject(newProj)}
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
