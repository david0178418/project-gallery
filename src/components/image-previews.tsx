import { ProjectImage } from '@common/types/Project';
import Grid from '@mui/material/Grid';

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
		<Grid
			rowGap={4}
			marginTop={2}
			container
			justifyContent="center"
		>
			{images.map(f => (
				<Grid
					key={f.url}
					item
					xs={4}
					md={2}
				>
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
				</Grid>
			))}
		</Grid>
	);
}
