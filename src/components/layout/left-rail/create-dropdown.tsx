import Link from 'next/link';
import { useRouter } from 'next/router';
import { MouseEvent, useState } from 'react';
import { ModalActions } from '@common/constants';
import {
	AddIcon,
	ProjectIcon,
	JournalIcon,
} from '@components/icons';
import {
	Fab,
	ListItemIcon,
	Menu,
	MenuItem,
} from '@mui/material';

export
function CreateDropdown() {
	const router = useRouter();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const {
		pathname,
		query,
	} = router;

	function handleEl(el: MouseEvent<HTMLElement>) {
		setAnchorEl(el.currentTarget);
	}

	function handleClose() {
		setAnchorEl(null);
	}

	return (
		<>
			<Fab
				color="primary"
				sx={{
					display: {
						xs: 'inline-flex',
						md: 'none',
					},
				}}
				onClick={handleEl}
			>
				<AddIcon/>
			</Fab>
			<Fab
				color="primary"
				variant="extended"
				sx={{
					width: '100%',
					display: {
						xs: 'none',
						md: 'inline-flex',
					},
				}}
				onClick={handleEl}
			>
				<AddIcon sx={{ mr: 1 }} />
				Create
			</Fab>
			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{ 'aria-labelledby': 'basic-button' }}
			>
				<Link
					shallow
					href={{
						pathname,
						query: {
							a: ModalActions.CreateProject,
							...query,
						},
					}}
				>
					<MenuItem onClick={handleClose}>
						<ListItemIcon>
							<ProjectIcon fontSize="small" />
						</ListItemIcon>
						Project
					</MenuItem>
				</Link>
				<Link
					shallow
					href={{
						pathname,
						query: {
							a: ModalActions.CreateJournal,
							...query,
						},
					}}
				>
					<MenuItem onClick={handleClose}>
						<ListItemIcon>
							<JournalIcon fontSize="small" />
						</ListItemIcon>
						Journal Post
					</MenuItem>
				</Link>
			</Menu>
		</>
	);
}
