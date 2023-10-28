import Link from 'next/link';
import { Paths } from '@common/constants';
import { getServerSession } from '@server/auth-options';
import CreateButton from './create-button';
import BottomNavItem from './bottom-nav-item';
import {
	BottomNavigation,
	BottomNavigationAction,
	Paper,
} from '@ui';
import {
	HomeIcon,
	LoginIcon,
	ProfileIcon,
	SettingsIcon,
	FavoriteIcon,
	GalleriesIcon,
	HomeActiveIcon,
	GalleriesActiveIcon,
	ProfileActiveIcon,
	FavoriteActiveIcon,
	SettingsActiveIcon,
} from '@components/icons';

export
async function BottomNav() {
	const session = await getServerSession();
	const user = session?.user;

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
			<BottomNavigation>
				<BottomNavItem
					label="Home"
					href={Paths.Home}
					activeIcon={<HomeActiveIcon />}
					inactiveIcon={<HomeIcon />}
				/>
				<BottomNavItem
					label="Galleries"
					href={Paths.Galleries}
					activeIcon={<GalleriesActiveIcon />}
					inactiveIcon={<GalleriesIcon />}
				/>
				{!user && (
					<BottomNavigationAction
						label="Login"
						href={Paths.UserLoginEmail}
						LinkComponent={Link}
						icon={<LoginIcon />}
					/>
				)}
				{!!user && (
					[
						<BottomNavItem
							key="a"
							label={user.username}
							href={Paths.UserGallery(user.username)}
							activeIcon={<ProfileActiveIcon />}
							inactiveIcon={<ProfileIcon />}
						/>,
						<BottomNavItem
							key="b"
							label="Favorites"
							href={Paths.Favorites}
							activeIcon={<FavoriteActiveIcon />}
							inactiveIcon={<FavoriteIcon />}
						/>,
						<BottomNavItem
							key="c"
							label="Settings"
							href={Paths.Settings}
							activeIcon={<SettingsActiveIcon />}
							inactiveIcon={<SettingsIcon />}
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
