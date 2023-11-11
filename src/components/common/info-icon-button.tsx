import { InfoIcon } from '@components/icons';
import { Button } from '@components/ui/button';
import Tooltip from './tooltip';

interface Props {
	label: string;
}

export default
function ShareIconButton(props: Props,) {
	const { label } = props;
	return (
		<Tooltip label={label} >
			<Button>
				<InfoIcon fontSize="small" />
			</Button>
		</Tooltip>
	);
}
