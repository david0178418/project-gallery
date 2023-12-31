'use client';
import { Paths } from '@common/constants';
import { share } from '@components/common/share-button';
import ProfileButton from './profile-button';
import { usePushToastMsg } from '@common/atoms';

interface Props {
	username: string;
}

export default
function ProfileShareButton(props: Props) {
	const { username } = props;
	const pushToastMsg = usePushToastMsg();

	return (
		<ProfileButton
			onClick={async () => {
				const result = await share(
					Paths.UserGallery(username),
					`${username}'s Project Gallery`,
					`Check out ${username}'s Project Gallery`,
				);

				pushToastMsg(result);
			}}
		>
			Share
		</ProfileButton>
	);
}
