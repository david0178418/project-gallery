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
} from '@components/icons';

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
				showLabels
				value={value}
				onChange={(event, newValue) => setValue(newValue)}
			>
				<BottomNavigationAction
					LinkComponent={Link}
					href={Paths.Home}
					label="Home"
					icon={
						Paths.Home === asPath ?
							<HomeActiveIcon /> :
							<HomeIcon />
					}
				/>
				{!user && (

					<BottomNavigationAction
						label="Login"
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
					<BottomNavigationAction
						LinkComponent={Link}
						label={user.username}
						href={Paths.Profile}
						icon={
							Paths.Profile === pathname ?
								<ProfileActiveIcon /> :
								<ProfileIcon />
						}
					/>
				)}
			</BottomNavigation>
		</Paper>
	);
}
