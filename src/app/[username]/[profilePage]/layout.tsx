import { ReactNode } from 'react';
import { Box, Typography } from '@ui';
import ProfileButton from '../profile-button';
import { Paths } from '@common/constants';
import { ProfilePages } from './profile-pages';

interface Props {
	children: ReactNode;
	params: {
		username: string;
		profilePage: string;
	};
}

export default async function UserGalleryProfilePageLayout(props: Props) {
	const {
		children,
		params: {
			profilePage,
			username,
		},
	} = props;

	const page = ProfilePages[profilePage as keyof typeof ProfilePages];

	if(!page) {
		return null;
	}

	return (
		<>
			<Box textAlign="center">
				<Typography
					fontWeight="bold"
					component="h3"
					fontSize={24}
					paddingBottom={3}
				>
					{page.label}
				</Typography>
				<ProfileButton href={Paths.UserGallery(username)}>
					Back
				</ProfileButton>
			</Box>
			<Box paddingY={1}>
				{children}
			</Box>
		</>
	);
}
