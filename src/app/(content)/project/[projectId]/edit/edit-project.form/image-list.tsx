import { ProjectImage } from '@common/types/Project';
import { Button } from '@components/ui/button';
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	DeleteIcon,
} from '@components/icons';

interface Props {
	images: ProjectImage[];
	onDelete(file: ProjectImage): void;
	onLeftClick(imageIndex: number): void;
	onRightClick(imageIndex: number): void;
}

export default
function ImageList(props: Props) {
	const {
		images,
		onDelete,
		onLeftClick,
		onRightClick,
	} = props;

	return (
		<div className="grid grid-cols-12 gap-4">
			{images.map((f, i) => (
				<div className="col-span-4" key={f.url}>
					<div className="group w=full relative border-b overflow-hidden rounded-md cursor-pointer">
						<img
							src={f.url}
							width="100%"
							style={{ objectFit: 'contain' }}
						/>
						<div className="hidden group-hover:block">
							{!!i && (
								<div className="absolute left-0 bottom-0">
									<Button onClick={() => onLeftClick(i)}>
										<ArrowLeftIcon/>
									</Button>
								</div>
							)}
							{i !== (images.length - 1) && (
								<div className="absolute left-0 bottom-0">
									<Button onClick={() => onRightClick(i)}>
										<ArrowRightIcon/>
									</Button>
								</div>
							)}
							<div className="absolute left-0 bottom-0">
								<Button onClick={() => onDelete(f)}>
									<DeleteIcon className="mr-2 h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
