
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSetAtom } from 'jotai';
import { loadingAtom, pushToastMsgAtom } from '@common/atoms';
import { useIsLoggedOut } from '@common/hooks';
import { CancelButton, ConfirmButton } from '@components/common/buttons';
import { nowISOString } from '@common/utils';
import { CloseIcon } from '@components/icons';
import { projectSave } from '@client/api-calls';
import EditProjectForm, { projectIsValid } from '@components/forms/edit-project.form';
import { useEffect, useState } from 'react';
import { WriteProject } from '@common/types/Project';
import { ModalActions } from '@common/constants';
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
} from '@ui';

function createWriteProject(): WriteProject {
	return {
		description: '',
		projectCreatedDate: nowISOString(),
		projectLastUpdatedDate: nowISOString(),
		title: '',
		images: [],
		labels: [],
		links: [],
		unlisted: false,
	};
}

export default
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
		setProject(createWriteProject());
		router.back();
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
				<EditProjectForm
					project={project}
					onChange={newProj => setProject(newProj)}
				/>
			</DialogContent>
			<DialogActions sx={{ gap: 2 }}>
				<CancelButton />
				<ConfirmButton
					onClick={handleSave}
					fullWidth={fullScreen}
					disabled={!isValid}
				/>
			</DialogActions>
		</Dialog>
	);
}
