import { ReactNode } from 'react';
import { Box } from '@ui';
import { ProfileLinkButton } from '@components/profile-button';
import { BackIcon } from '@components/icons';
import { Paths, SpecialCharacterCodes } from '@common/constants';
import { fetchUser } from '@server/queries';
import { UsernameValidation } from '@common/types/UserCredentials';

interface Props {
	children: ReactNode;
	params: {
		username: string;
	};
}

export default async function UserGalleryProfilePageLayout(props: Props) {
	const {
		children, params: { username: routeUsername },
	} = props;

	const result = await UsernameValidation.safeParseAsync(routeUsername);
	const pageUser = result.success ?
		await fetchUser(result.data) :
		null;
	const username = pageUser?.username;

	if(!username) {
		return (
			<>
				User not found.
			</>
		);
	}

	return (
		<Box paddingY={1} textAlign="center">
			<ProfileLinkButton
				icon={BackIcon}
				href={Paths.UserGallery(username)}
			>
				{username}{SpecialCharacterCodes.RSQUO}s Gallery
			</ProfileLinkButton>
			{children}
		</Box>
	);
}
