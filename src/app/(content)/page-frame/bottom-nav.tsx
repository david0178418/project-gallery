'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Paths } from '@common/constants';
import { forwardRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
	BottomNavigation,
	BottomNavigationAction,
	Box,
	Paper,
	SpeedDial,
	SpeedDialAction,
} from '@ui';
import {
	SpeedDialIcon,
	HomeActiveIcon,
	HomeIcon,
	LoginIcon,
	ProfileActiveIcon,
	ProfileIcon,
	SettingsActiveIcon,
	SettingsIcon,
	ProjectIcon,
	JournalIcon,
	FavoriteActiveIcon,
	FavoriteIcon,
} from '@components/icons';

// TODO Figure out the weird link behavior

export
function BottomNav() {
	const { data } = useSession();
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const pathname = usePathname()!;
	const user = data?.user;

	return (
		<Paper
			elevation={3}
			sx={{
				position: 'fixed',
				bottom: 0,
				left: 0,
				right: 0,
				display: {
					xs: 'inline',
					sm: 'none',
				},
			}}
		>
			<BottomNavigation
				showLabels
				value={pathname}
			>
				<BottomNavigationAction
					label="Home"
					LinkComponent={Link}
					href={Paths.Home}
					value={Paths.Home}
					icon={
						Paths.Home === pathname ?
							<HomeActiveIcon /> :
							<HomeIcon />
					}
				/>
				{!user && (
					<BottomNavigationAction
						label="Login"
						href="TODO-why-is-this-hack-needed"
						icon={<LoginIcon />}
						LinkComponent={forwardRef((props, ref) => (
							<Link
								ref={ref}
								{...props}
								href={Paths.UserLoginEmail}
							/>
						))}
					/>
				)}
				{!!user && (
					[
						<BottomNavigationAction
							key="a"
							label={user.username}
							LinkComponent={Link}
							href={Paths.UserGallery(user.username)}
							value={Paths.UserGallery(user.username)}
							icon={
								Paths.UserGallery(user.username) === pathname ?
									<ProfileActiveIcon /> :
									<ProfileIcon />
							}
						/>,
						<BottomNavigationAction
							key="b"
							label="Favorites"
							LinkComponent={Link}
							href={Paths.Favorites}
							value={Paths.Favorites}
							icon={
								Paths.Favorites === pathname ?
									<FavoriteActiveIcon /> :
									<FavoriteIcon />
							}
						/>,
						<BottomNavigationAction
							key="c"
							label="Settings"
							LinkComponent={Link}
							href={Paths.Settings}
							value={Paths.Settings}
							icon={
								Paths.Settings === pathname ?
									<SettingsActiveIcon /> :
									<SettingsIcon />
							}
						/>,
					]
				)}
			</BottomNavigation>
			{!!user && (
				<CreateButton/>
			)}
		</Paper>
	);
}

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
