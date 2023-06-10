import Link from 'next/link';
import { CreateDropdown } from './create-dropdown';
import Logo from './logo';
import { RailButtonContent } from './rail-button-content';
import { Paths } from '@common/constants';
import { LeftRailItem } from './left-rail-item';
import { Session } from 'next-auth';
import {
	List,
	ListItem,
	ListItemButton,
} from '@ui';
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

interface Props {
	session: Session | null;
}

// TODO Implement better path matching for active icon
export
async function LeftRail(props: Props) {
	const { session } = props;
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
				{!user && (
					<>
						<ListItem disablePadding>
							<Link
								shallow
								passHref
								legacyBehavior
								href={Paths.ModalLoginEmail}
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
								href={Paths.ModalRegister}
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
							path={Paths.UserGallery(user.name || '')}
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
