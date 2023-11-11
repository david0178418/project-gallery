
import { DeleteIcon } from '@components/icons';
import { UiProject } from '@common/types/Project';
import { Button } from './ui/button';

interface Props {
	links: UiProject['links'][number][];
	onRemove?(linkIndex: number): void;
}

export default
function LinksList(props: Props) {
	const {
		links,
		onRemove,
	} = props;

	return (
		<ul className="divide-y divide-gray-100">
			{links.map((l, i) => (
				<li className="flex justify-between gap-x-6 py-5" key={i}>
					{onRemove && (
						<div className="h-12 w-12 flex-none rounded-full bg-gray-50">
							<Button onClick={() => onRemove(i)}>
								<DeleteIcon />
							</Button>
						</div>
					)}
					<div className="min-w-0 flex-auto">
						<a href={l.url} target="_blank">
							{l.label}
						</a>
					</div>
				</li>
			))}
		</ul>
	);
}
