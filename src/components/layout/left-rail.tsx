import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import {
	MouseEvent, ReactNode, useState,
} from 'react';
import { urlJoin } from '@common/utils';
import {
	ModalActions,
	Paths,
} from '@common/constants';
import {
	AddIcon,
	HomeActiveIcon,
	LoginIcon,
	HomeIcon,
	ProfileActiveIcon,
	ProfileIcon,
	SettingsActiveIcon,
	SettingsIcon,
	ProjectIcon,
	JournalIcon,
} from '@components/icons';
import {
	Fab,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
} from '@mui/material';

interface Props {
	label: string;
	secondary?: string;
	children: ReactNode;
}

function RailButtonContent(props: Props) {
	const {
		label,
		secondary = '',
		children,
	} = props;
	return (
		<>
			<ListItemIcon>
				{children}
			</ListItemIcon>
			<ListItemText
				primary={label}
				secondary={secondary}
				sx={{
					display: {
						xs: 'none',
						md: 'inline',
					},
				}}
			/>
		</>
	);
}

// TODO Implement better path matching for active icon

function LeftRail() {
	const router = useRouter();
	const { data } = useSession();
	const {
		pathname,
		query,
	} = router;
	const user = data?.user;

	return (
		<>
			<List>
				<ListItem disablePadding>
					<Link
						shallow
						passHref
						legacyBehavior
						href={Paths.Home}
					>
						<ListItemButton>
							<RailButtonContent label="Home">
								{
									Paths.Home === pathname ?
										<HomeActiveIcon /> :
										<HomeIcon />
								}
							</RailButtonContent>
						</ListItemButton>
					</Link>
				</ListItem>
				{!user && (
					<>
						<ListItem disablePadding>
							<Link
								shallow
								passHref
								legacyBehavior
								href={{
									pathname,
									query: {
										a: ModalActions.LoginRegister,
										...query,
									},
								}}
							>
								<ListItemButton>
									<RailButtonContent
										label="Login"
										secondary="or register"
									>
										<LoginIcon/>
									</RailButtonContent>
								</ListItemButton>
							</Link>
						</ListItem>
					</>
				)}
				{!!user && (
					<>
						<ListItem disablePadding>
							<Link
								shallow
								passHref
								legacyBehavior
								href={urlJoin(Paths.UserGallery, user?.username)}
							>
								<ListItemButton>
									<RailButtonContent
										label={user.username}
									>
										{
											pathname.startsWith(Paths.UserGallery) ?
												<ProfileActiveIcon /> :
												<ProfileIcon />
										}
									</RailButtonContent>
								</ListItemButton>
							</Link>
						</ListItem>
						<ListItem disablePadding>
							<Link
								shallow
								passHref
								legacyBehavior
								href={Paths.Settings}
							>
								<ListItemButton>
									<RailButtonContent
										label="Settings"
									>
										{
											Paths.Settings === pathname ?
												<SettingsActiveIcon /> :
												<SettingsIcon />
										}
									</RailButtonContent>
								</ListItemButton>
							</Link>
						</ListItem>
						<CreateDropdown/>
					</>
				)}
			</List>
		</>
	);
}

export { LeftRail };

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
