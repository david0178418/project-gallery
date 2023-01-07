import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';
import { CreateDropdown } from './create-dropdown';
import logoImage from './logo.png';
import logoSmallImage from './logo-small.png';
import Image from 'next/image';
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
	JournalActiveIcon,
	JournalIcon,
} from '@components/icons';
import {
	Box,
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
			<Link passHref href={Paths.Home} legacyBehavior>
				<Box
					component="a"
					sx={{
						width: '100%',
						paddingLeft: 1.5,
					}}
				>
					<Box
						sx={{
							display: {
								xs: 'none',
								md: 'block',
							},
						}}
					>
						<Image
							alt=""
							style={{
								maxWidth: '100%',
								height: 'auto',
							}}
							src={logoImage} />
					</Box>
					<Box
						sx={{
							display: {
								xs: 'block',
								md: 'none',
							},
							paddingLeft: 1,
						}}
					>
						<Image
							alt=""
							src={logoSmallImage}
						/>
					</Box>
				</Box>
			</Link>
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
								href={Paths.UserJournals(user.username)}
							>
								<ListItemButton>
									<RailButtonContent label="My Journals">
										{
											Paths.UserJournals(user.username) === asPath ?
												<JournalActiveIcon /> :
												<JournalIcon />
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
