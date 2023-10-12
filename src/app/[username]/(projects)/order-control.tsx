'use client';
import { Box, IconButton } from '@ui';
import updateProjectsOrder from './update-projects-order';
import { Direction, DirectionEnum } from '@common/constants';
import { useSetLoading } from '@common/atoms';
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
	const setLoading = useSetLoading();

	async function handleUpdateProjectOrder(direction: DirectionEnum) {
		setLoading(true);

		try {
			await updateProjectsOrder({
				projectId,
				direction,
			});
		} catch {
			// do stuff
		}

		setLoading(false);
	}

	return (
		<>
			{!first && (
				<Box>
					<IconButton
						size="large"
						onClick={() => handleUpdateProjectOrder(Direction.Left)}
						sx={{
							borderRadius: '0 5px 5px 0',
							opacity: .1,
							width: 35,
							height: 100,
							transition: 'opacity .25s',
							backgroundColor: 'black',
							':hover': {
								opacity: .85,
								backgroundColor: 'black',
							},
						}}
					>
						<Box
							component={ArrowLeftIcon}
							color="white"
							display={{
								xs: 'none',
								sm: 'inline',
							}}
						/>
						<Box
							component={ArrowUpIcon}
							color="white"
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
						onClick={() => handleUpdateProjectOrder(Direction.Right)}
						sx={{
							borderRadius: '5px 0 0 5px',
							opacity: .1,
							width: 35,
							height: 100,
							transition: 'opacity .25s',
							backgroundColor: 'black',
							':hover': {
								opacity: .85,
								backgroundColor: 'black',
							},
						}}
					>
						<Box
							component={ArrowRightIcon}
							color="white"
							display={{
								xs: 'none',
								sm: 'inline',
							}}
						/>
						<Box
							component={ArrowDownIcon}
							color="white"
							display={{
								xs: 'inline',
								sm: 'none',
							}}
						/>
					</IconButton>
				</Box>
			)}
		</>
	);
}
