'use client';
import { urlJoin } from '@common/utils';
import { ShareIcon } from '@components/icons';
import { Button } from '@components/ui/button';
import Tooltip from './tooltip';
import { toast } from 'sonner';

interface Props {
	label: string;
	url: string;
	shareMsg: string;
}

export
// TODO Was adding the tooltip an oversight?
// const ShareIconButton = forwardRef((props: Props, ref) => {
function ShareIconButton(props: Props) {
	const {
		label,
		url,
		shareMsg,
	} = props;

	async function handleShare() {
		toast(await share(url, label, shareMsg));
	}

	return (
		<Tooltip label={`Share '${label}'`}>
			<Button onClick={handleShare}>
				<ShareIcon fontSize="small" />
			</Button>
		</Tooltip>
	);
}

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
