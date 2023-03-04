import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';
import { CreateDropdown } from './create-dropdown';
import Logo from './logo';
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
	FavoriteActiveIcon,
	FavoriteIcon,
	RegisterIcon,
} from '@components/icons';
import {
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
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
export
function LeftRail() {
	const router = useRouter();
	const { data } = useSession();
	const {
		pathname,
		asPath,
		query,
	} = router;
	const user = data?.user;

	return (
		<>
			<Logo />
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
										a: ModalActions.Login,
										...query,
									},
								}}
							>
								<ListItemButton>
									<RailButtonContent
										label="Login"
									>
										<LoginIcon/>
									</RailButtonContent>
								</ListItemButton>
							</Link>
						</ListItem>
						<ListItem disablePadding>
							<Link
								shallow
								passHref
								legacyBehavior
								href={{
									pathname,
									query: {
										a: ModalActions.Register,
										...query,
									},
								}}
							>
								<ListItemButton>
									<RailButtonContent
										label="Register"
									>
										<RegisterIcon />
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
								href={Paths.UserGallery(user.username)}
							>
								<ListItemButton>
									<RailButtonContent
										label={user.username}
									>
										{
											Paths.UserGallery(user.username) === asPath ?
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
								href={Paths.Favorites}
							>
								<ListItemButton>
									<RailButtonContent
										label="Favorites"
									>
										{
											Paths.Favorites === asPath ?
												<FavoriteActiveIcon /> :
												<FavoriteIcon />
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
