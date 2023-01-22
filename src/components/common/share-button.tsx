import { usePushToastMsg } from '@common/atoms';
import { urlJoin } from '@common/utils';
import { ShareIcon } from '@components/icons';
import { IconButton, Tooltip } from '@mui/material';

interface Props {
	label: string;
	url: string;
}

export
function ShareIconButton(props: Props) {
	const pushToastMsg = usePushToastMsg();
	const {
		label,
		url,
	} = props;

	async function handleShare() {
		const shareMsg = await share(url, label);
		pushToastMsg(shareMsg);
	}

	return (
		<Tooltip title={`Share '${label}'`}>
			<IconButton size="small" onClick={handleShare}>
				<ShareIcon fontSize="small" />
			</IconButton>
		</Tooltip>
	);
}

async function share(url: string, label: string) {
	if(!navigator.share) {
		await navigator.clipboard.writeText(urlJoin(location.origin, url));
		return `Copied url to "${label}"!`;
	} else {
		await navigator.share({
			title: `ShopLystr List: '${label}'`,
			text: 'Check out this shopping list!',
			url: url,
		});

		return `'${label}' shared.`;
	}
}
