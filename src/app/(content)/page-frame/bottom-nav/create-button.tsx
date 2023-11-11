'use client';
// import Link from 'next/link';
// import { Paths } from '@common/constants';
// import { useState } from 'react';
// import {
// 	SpeedDialIcon,
// 	ProjectIcon,
// 	JournalIcon,
// } from '@components/icons';

export default
function CreateButton() {
	// const [open, setOpen] = useState(false);

	return (
		<div className="absolute bottom-20 right-10">
			{/** Get Speed dial.  Maybe this...? https://flowbite.com/docs/components/speed-dial/ */}
			{/* <SpeedDial
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
			</SpeedDial> */}
		</div>
	);
}
