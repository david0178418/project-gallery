import { ProjectImage } from '@common/types/Project';

interface Props {
	images: ProjectImage[];
	onClick(file: ProjectImage): void;
}

export
function ImagePreviews(props: Props) {
	const {
		images,
		onClick,
	} = props;

	return (
		<div className="grid grid-cols-12 gap-4 mt-2">
			{images.map(f => (
				<div key={f.url} className="col-span-4 md:col-span-2">
					<img
						src={f.url}
						onClick={() => onClick(f)}
						style={{
							cursor: 'pointer',
							height: 100,
							width: 100,
							objectFit: 'contain',
						}}
					/>
				</div>
			))}
		</div>
	);
}
