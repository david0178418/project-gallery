import { Paths } from '@common/constants';
import { getServerSession } from '@server/auth-options';
import CreateButton from './create-button';
import BottomNavItem from './bottom-nav-item';
import { cn } from '@/lib/utils';
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
// https://flowbite.com/docs/components/bottom-navigation/
async function BottomNav() {
	const session = await getServerSession();
	const user = session?.user;

	return (
		<div className={cn(
			'fixed',
			'bottom-0',
			'left-0',
			'z-50',
			'w-full',
			'h-16',
			'bg-white',
			'border-t',
			'border-gray-200',
			'dark:bg-gray-700',
			'dark:border-gray-600'
		)}>
			<div className={cn(
				'grid',
				'h-full',
				'max-w-lg',
				'grid-cols-4',
				'mx-auto',
				'font-medium',
			)}>
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
					<BottomNavItem
						label="Login"
						href={Paths.UserLoginEmail}
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
				{!!user && (
					<CreateButton/>
				)}
			</div>
		</div>
	);
}
