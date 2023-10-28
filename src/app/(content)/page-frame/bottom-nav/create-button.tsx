'use client';
import Link from 'next/link';
import { Paths } from '@common/constants';
import { useState } from 'react';
import {
	Box,
	SpeedDial,
	SpeedDialAction,
} from '@ui';
import {
	SpeedDialIcon,
	ProjectIcon,
	JournalIcon,
} from '@components/icons';

export default
function CreateButton() {
	const [open, setOpen] = useState(false);

	return (
		<Box
			sx={{
				position: 'absolute',
				bottom: 64,
				right: 16,
			}}>
			<SpeedDial
				ariaLabel=""
				icon={<SpeedDialIcon />}
				direction="up"
				open={open}
				onOpen={() => setOpen(true)}
				onClose={() => setOpen(false)}
			>
				<SpeedDialAction
					tooltipTitle="Project"
					icon={<ProjectIcon/>}
					FabProps={{
						component: Link,
						href: Paths.ProjectEdit(),
					}}
				/>
				<SpeedDialAction
					tooltipTitle="Journal Post"
					icon={<JournalIcon/>}
					onClick={() => setOpen(false)}
					FabProps={{
						component: Link,
						href: Paths.JournalEdit(),
					}}
				/>
			</SpeedDial>
		</Box>
	);
}
