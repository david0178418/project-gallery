'use client';
import { usePushToastMsg } from '@common/atoms';
import { urlJoin } from '@common/utils';
import { ShareIcon } from '@components/icons';
import { IconButton, Tooltip } from '@ui';

interface Props {
	label: string;
	url: string;
	shareMsg: string;
}

export
// TODO Was adding the tooltip an oversight?
// const ShareIconButton = forwardRef((props: Props, ref) => {
function ShareIconButton(props: Props) {
	const pushToastMsg = usePushToastMsg();
	const {
		label,
		url,
		shareMsg,
	} = props;

	async function handleShare() {
		pushToastMsg(await share(url, label, shareMsg));
	}

	return (
		<Tooltip title={`Share '${label}'`}>
			<IconButton size="small" onClick={handleShare}>
				<ShareIcon fontSize="small" />
			</IconButton>
		</Tooltip>
	);
}

export
async function share(url: string, label: string, shareMsg: string) {
	if(!navigator.share) {
		await navigator.clipboard.writeText(urlJoin(location.origin, url));
		return `Copied url to "${label}"!`;
	} else {
		await navigator.share({
			title: `${label} - ProjectGallery.me`,
			text: shareMsg,
			url: url,
		});

		return `'${label}' shared.`;
	}
}
