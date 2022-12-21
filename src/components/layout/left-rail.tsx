import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';
import {
	ModalActions,
	Paths,
} from '@common/constants';
import {
	HomeActiveIcon,
	LoginIcon,
	HomeIcon,
	ProfileActiveIcon,
	ProfileIcon,
	SettingsActiveIcon,
	SettingsIcon,
	CreateIcon,
} from '@components/icons';
import {
	Fab,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from '@mui/material';
import { urlJoin } from '@common/utils';

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
								href={urlJoin(Paths.Projects, user?.username)}
							>
								<ListItemButton>
									<RailButtonContent
										label={user.username}
									>
										{
											pathname.startsWith(Paths.Projects) ?
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
							<>
								<Fab
									color="primary"
									sx={{
										display: {
											xs: 'inline-flex',
											md: 'none',
										},
									}}
								>
									<CreateIcon/>
								</Fab>
								<Fab
									variant="extended"
									color="primary"
									style={{ width: '100%' }}
									sx={{
										display: {
											xs: 'none',
											md: 'inline-flex',
										},
									}}
								>
									<CreateIcon sx={{ mr: 1 }} />
									Create Project
								</Fab>
							</>
						</Link>
					</>
				)}
			</List>
		</>
	);
}

export { LeftRail };
