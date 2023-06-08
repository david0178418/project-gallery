'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CreateDropdown } from './create-dropdown';
import Logo from './logo';
import { RailButtonContent } from './rail-button-content';
import { useUpdateQueryParam } from '@common/hooks';
import { ModalActions, Paths } from '@common/constants';
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

// TODO Implement better path matching for active icon
export
function LeftRail() {
	const { data } = useSession();
	const pathname = usePathname();
	const user = data?.user;

	const updateQueryParam = useUpdateQueryParam();

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
								href={updateQueryParam('a', ModalActions.Login)}
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
									query: updateQueryParam('a', ModalActions.Register),
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
											Paths.UserGallery(user.username) === pathname ?
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
											Paths.Favorites === pathname ?
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
