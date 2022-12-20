import { forwardRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
	ModalActions,
	Paths,
} from '@common/constants';
import {
	BottomNavigation,
	BottomNavigationAction,
	Paper,
} from '@mui/material';
import {
	HomeActiveIcon,
	HomeIcon,
	LoginIcon,
	ProfileActiveIcon,
	ProfileIcon,
	SettingsActiveIcon,
	SettingsIcon,
} from '@components/icons';
import { urlJoin } from '@common/utils';

// TODO Figure out the weird link behavior

export
function BottomNav() {
	const router = useRouter();
	const { data } = useSession();
	const [value, setValue] = useState(0);
	const user = data?.user;
	const {
		asPath,
		pathname,
		query,
	} = router;

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
			<BottomNavigation
				// showLabels Something wrong with this combined with the BottomNavigationAction/Link combo
				value={value}
				onChange={(event, newValue) => setValue(newValue)}
			>
				<BottomNavigationAction
					LinkComponent={Link}
					href={Paths.Home}
					// label="Home"
					icon={
						Paths.Home === asPath ?
							<HomeActiveIcon /> :
							<HomeIcon />
					}
				/>
				{!user && (
					<BottomNavigationAction
						// label="Login"
						icon={<LoginIcon />}
						href="TODO-why-is-this-hack-needed"
						LinkComponent={forwardRef((props, ref) => (
							<Link
								ref={ref}
								{...props}
								href={{
									pathname,
									query: {
										a: ModalActions.LoginRegister,
										...query,
									},
								}}
							/>
						))}
					/>
				)}
				{!!user && (
					<>
						<BottomNavigationAction
							LinkComponent={Link}
							// label={user.username}
							href={urlJoin(Paths.Projects, user?.username)}
							icon={
								pathname.startsWith(Paths.Projects) ?
									<ProfileActiveIcon /> :
									<ProfileIcon />
							}
						/>
						<BottomNavigationAction
							LinkComponent={Link}
							label="Settings"
							href={Paths.Settings}
							icon={
								Paths.Settings === pathname ?
									<SettingsActiveIcon /> :
									<SettingsIcon />
							}
						/>
					</>
				)}
			</BottomNavigation>
		</Paper>
	);
}
