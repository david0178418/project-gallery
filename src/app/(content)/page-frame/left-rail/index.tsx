// import Link from 'next/link';
import { CreateDropdown } from './create-dropdown';
// import Logo from './logo';
// import { RailButtonContent } from './rail-button-content';
import { Paths } from '@common/constants';
import LeftRailItem from './left-rail-item';
import { getServerSession } from '@server/auth-options';
import {
	HomeActiveIcon,
	// LoginIcon,
	HomeIcon,
	ProfileActiveIcon,
	ProfileIcon,
	SettingsActiveIcon,
	SettingsIcon,
	FavoriteActiveIcon,
	FavoriteIcon,
	// RegisterIcon,
	GalleriesActiveIcon,
	GalleriesIcon,
} from '@components/icons';

// // TODO Implement better path matching for active icon
// export
// async function LeftRail() {
// 	const session = await getServerSession();
// 	const user = session?.user;

// 	return (
// 		<>
// 			<Logo />
// 			<ul className="divide-y divide-gray-100">
// 				<LeftRailItem
// 					label="Home"
// 					path={Paths.Home}
// 					ActiveIcon={HomeActiveIcon}
// 					InactiveIcon={HomeIcon}
// 				/>
// 				<LeftRailItem
// 					label="Galleries"
// 					path={Paths.Galleries}
// 					ActiveIcon={GalleriesActiveIcon}
// 					InactiveIcon={GalleriesIcon}
// 				/>
// 				{!user && (
// 					<>
// 						<li className="flex justify-between gap-x-6 py-5">
// 							<div className="flex min-w-0 gap-x-4">
// 								<Link
// 									href={Paths.UserLoginEmail}
// 								>
// 									<RailButtonContent
// 										label="Login"
// 									>
// 										<LoginIcon/>
// 									</RailButtonContent>
// 								</Link>
// 							</div>
// 						</li>
// 						<li className="flex justify-between gap-x-6 py-5">
// 							<div className="flex min-w-0 gap-x-4">
// 								<Link
// 									shallow
// 									passHref
// 									legacyBehavior
// 									href={Paths.UserRegister}
// 								>
// 									<RailButtonContent
// 										label="Register"
// 									>
// 										<RegisterIcon />
// 									</RailButtonContent>
// 								</Link>
// 							</div>
// 						</li>
// 					</>
// 				)}
// 				{!!user && (
// 					<>
// 						<LeftRailItem
// 							label={user.username}
// 							path={Paths.UserGallery(user.username || '')}
// 							ActiveIcon={ProfileActiveIcon}
// 							InactiveIcon={ProfileIcon}
// 						/>
// 						<LeftRailItem
// 							label="Favorites"
// 							path={Paths.Favorites}
// 							ActiveIcon={FavoriteActiveIcon}
// 							InactiveIcon={FavoriteIcon}
// 						/>
// 						<LeftRailItem
// 							label="Settings"
// 							path={Paths.Settings}
// 							ActiveIcon={SettingsActiveIcon}
// 							InactiveIcon={SettingsIcon}
// 						/>
// 						<CreateDropdown/>
// 					</>
// 				)}
// 			</ul>
// 		</>
// 	);
// }

export default
async function LeftRail() {
	const session = await getServerSession();
	const user = session?.user;
	return (
		<aside className="fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700">
			<div className="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800">
				<ul className="space-y-2">
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
				</ul>
			</div>
		</aside>
	);
}
