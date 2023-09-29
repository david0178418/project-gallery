'use client';

import Link from 'next/link';
import { MouseEvent, useState } from 'react';
import { ModalActions } from '@common/constants';
import { useUpdateQueryParam } from '@common/hooks';
import {
	AddIcon,
	ProjectIcon,
	EditIcon,
} from '@components/icons';
import {
	Fab,
	ListItemIcon,
	Menu,
	MenuItem,
} from '@ui';

export
function CreateDropdown() {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const updateQueryParam = useUpdateQueryParam();

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
					href={updateQueryParam('a', ModalActions.CreateProject)}
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
					href={updateQueryParam('a', ModalActions.CreateJournal)}
				>
					<MenuItem onClick={handleClose}>
						<ListItemIcon>
							<EditIcon fontSize="small" />
						</ListItemIcon>
						Journal Post
					</MenuItem>
				</Link>
			</Menu>
		</>
	);
}