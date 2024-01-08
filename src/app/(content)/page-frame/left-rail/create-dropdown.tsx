'use client';

import Link from 'next/link';
import { MouseEvent, useState } from 'react';
import { Paths } from '@common/constants';
import Fab from '@mui/material/Fab';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {
	AddIcon,
	ProjectIcon,
	EditIcon,
} from '@components/icons';

export
function CreateDropdown() {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

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
					href={Paths.ProjectEdit()}
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
					href={Paths.JournalEdit()}
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
