'use client';
import updateProjectsOrder from './update-projects-order';
import { Direction, DirectionEnum } from '@common/constants';
import { useSetLoading } from '@common/atoms';
import { Button } from '@components/ui/button';
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
				<div>
					<Button
						onClick={() => handleUpdateProjectOrder(Direction.Left)}
						className="rounded-r-2xl opacity-10 w-[35px] h-96 transition-opacity bg-black hover:opacity-80"
					>
						<div className="text-white hidden sm:inline">
							<ArrowLeftIcon/>
						</div>
						<div className="text-white inline sm:hidden">
							<ArrowUpIcon/>
						</div>
					</Button>
				</div>
			)}
			{!last && (
				<div className="ml-auto">
					<Button
						onClick={() => handleUpdateProjectOrder(Direction.Right)}
						className="rounded-l-2xl opacity-10 w-32 h-96 transition-opacity bg-black hover:opacity-80"
					>
						<div className="text-white hidden sm:inline">
							<ArrowRightIcon/>
						</div>
						<div className="text-white inline sm:hidden">
							<ArrowDownIcon/>
						</div>
					</Button>
				</div>
			)}
		</>
	);
}
