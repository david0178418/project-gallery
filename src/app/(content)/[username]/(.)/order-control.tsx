'use client';
import { Box, IconButton } from '@ui';
import { updateProjectsOrder } from './actions';
import { Direction } from '@common/constants';
import {
	ArrowDownIcon,
	ArrowLeftIcon,
	ArrowRightIcon,
	ArrowUpIcon,
} from '@components/icons';

interface Props {
	first?: boolean;
	last?: boolean;
	projectId: string;
}

export default
function OrderControlBlock(props: Props) {
	const {
		last,
		first,
		projectId,
	} = props;

	return (
		<Box
			top={0}
			position="absolute"
			width="100%"
			className="change-order-action"
		>
			{!first && (
				<Box>
					<IconButton
						size="large"
						onClick={() => updateProjectsOrder({
							projectId,
							direction: Direction.Left,
						})}
					>
						<Box
							component={ArrowLeftIcon}
							display={{
								xs: 'none',
								sm: 'inline',
							}}
						/>
						<Box
							component={ArrowUpIcon}
							display={{
								xs: 'inline',
								sm: 'none',
							}}
						/>
					</IconButton>
				</Box>
			)}
			{!last && (
				<Box marginLeft="auto">
					<IconButton
						size="large"
						onClick={() => updateProjectsOrder({
							projectId,
							direction: Direction.Right,
						})}
					>
						<Box
							component={ArrowRightIcon}
							display={{
								xs: 'none',
								sm: 'inline',
							}}
						/>
						<Box
							component={ArrowDownIcon}
							display={{
								xs: 'inline',
								sm: 'none',
							}}
						/>
					</IconButton>
				</Box>
			)}
		</Box>
	);
}
