import { forwardRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { urlJoin } from '@common/utils';
import {
	ModalActions,
	Paths,
} from '@common/constants';
import {
	BottomNavigation,
	BottomNavigationAction,
	Box,
	Paper,
	SpeedDial,
	SpeedDialAction,
} from '@mui/material';
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
} from '@components/icons';

// TODO Figure out the weird link behavior

export
function BottomNav() {
	const { data } = useSession();
	const [value, setValue] = useState(0);
	const {
		asPath,
		pathname,
		query,
	} = useRouter();
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
				value={value}
				onChange={(event, newValue) => setValue(newValue)}
			>
				<BottomNavigationAction
					LinkComponent={Link}
					href={Paths.Home}
					label="Home"
					icon={
						Paths.Home === asPath ?
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
								href={{
									pathname,
									query: {
										a: ModalActions.LoginRegister,
										...query,
									},
								}}
							/>
						))}
					/>
				)}
				{!!user && (
					[
						<BottomNavigationAction
							key="a"
							LinkComponent={Link}
							label={user.username}
							href={urlJoin(Paths.UserGallery, user?.username)}
							icon={
								pathname.startsWith(Paths.UserGallery) ?
									<ProfileActiveIcon /> :
									<ProfileIcon />
							}
						/>,
						<BottomNavigationAction
							key="b"
							LinkComponent={Link}
							label="Settings"
							href={Paths.Settings}
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
	const {
		pathname,
		query,
		push,
	} = useRouter();

	// Is NextJS Url type exposed somewhere??
	function handleRoute(url: Parameters<typeof push>[0]) {
		push(url);
		setOpen(false);
	}

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
					onClick={() => handleRoute(
						{
							pathname,
							query: {
								a: ModalActions.CreateProject,
								...query,
							},
						},
					)}
				/>
				<SpeedDialAction
					tooltipTitle="Journal Post"
					icon={<JournalIcon/>}
					onClick={() => setOpen(false)}
				/>
			</SpeedDial>
		</Box>
	);
}
