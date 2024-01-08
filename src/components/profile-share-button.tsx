'use client';
import { share } from '@components/common/share-button';
import { ProfileButton } from './profile-button';
import { usePushToastMsg } from '@common/atoms';
import { ShareIcon } from './icons';

interface Props {
	shareObj: {
		url: string;
		label: string;
		shareMsg: string;
	}
}

export default
function ProfileShareButton(props: Props) {
	const {
		shareObj: {
			url,
			label,
			shareMsg,
		},
	} = props;
	const pushToastMsg = usePushToastMsg();

	return (
		<ProfileButton
			iconColor="#369E19"
			icon={ShareIcon}
			onClick={async () => {
				const result = await share(
					url,
					label,
					shareMsg,
				);

				pushToastMsg(result);
			}}
		>
			Share
		</ProfileButton>
	);
}
