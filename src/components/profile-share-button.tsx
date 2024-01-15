'use client';
import { share } from '@components/common/share-button';
import { ProfileButton } from './profile-button';
import { usePushToastMsg } from '@common/atoms';
import { ShareIcon } from './icons';

interface Props {
	disabled?: boolean;
	shareObj?: {
		url: string;
		label: string;
		shareMsg: string;
	};
}

export default
function ProfileShareButton(props: Props) {
	const {
		disabled,
		shareObj,
	} = props;
	const pushToastMsg = usePushToastMsg();

	return (
		<ProfileButton
			disabled={disabled}
			iconColor="#369E19"
			icon={ShareIcon}
			onClick={async () => {
				if(!shareObj) {
					return;
				}

				const {
					url,
					label,
					shareMsg,
				} = shareObj;

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
