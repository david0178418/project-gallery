import Link from 'next/link';
import { CreateDropdown } from './create-dropdown';
import Logo from './logo';
import { RailButtonContent } from './rail-button-content';
import { Paths } from '@common/constants';
import { LeftRailItem } from './left-rail-item';
import { getServerSession } from '@server/auth-options';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
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
	GalleriesActiveIcon,
	GalleriesIcon,
} from '@components/icons';

// TODO Implement better path matching for active icon
export
async function LeftRail() {
	const session = await getServerSession();
	const user = session?.user;

	return (
		<>
			<Logo />
			<List>
				<LeftRailItem
					label="Home"
					path={Paths.Home}
					ActiveIcon={HomeActiveIcon}
					InactiveIcon={HomeIcon}
				/>
				<LeftRailItem
					label="Galleries"
					path={Paths.Galleries}
					ActiveIcon={GalleriesActiveIcon}
					InactiveIcon={GalleriesIcon}
				/>
				{!user && (
					<>
						<ListItem disablePadding>
							<Link
								shallow
								passHref
								legacyBehavior
								href={Paths.UserLoginEmail}
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
								href={Paths.UserRegister}
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
						<LeftRailItem
							label={user.username}
							path={Paths.UserGallery(user.username || '')}
							ActiveIcon={ProfileActiveIcon}
							InactiveIcon={ProfileIcon}
						/>
						<LeftRailItem
							label="Favorites"
							path={Paths.Favorites}
							ActiveIcon={FavoriteActiveIcon}
							InactiveIcon={FavoriteIcon}
						/>
						<LeftRailItem
							label="Settings"
							path={Paths.Settings}
							ActiveIcon={SettingsActiveIcon}
							InactiveIcon={SettingsIcon}
						/>
						<CreateDropdown/>
					</>
				)}
			</List>
		</>
	);
}
