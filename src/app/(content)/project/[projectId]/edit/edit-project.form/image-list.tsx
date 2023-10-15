import { ProjectImage } from '@common/types/Project';
import {
	Box,
	Grid,
	IconButton,
} from '@ui';
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
		<Grid
			container
			rowGap={4}
			marginTop={2}
			spacing={2}
		>
			{images.map((f, i) => (
				<Grid
					item
					key={f.url}
					xs={4}
				>
					<Box
						width="100%"
						position="relative"
						border="1px solid"
						overflow="hidden"
						padding={1}
						borderRadius={2}
						sx={{
							cursor: 'pointer',
							'& .actions': { sm: { display: 'none' } },
							'&:hover .actions': { display: 'block' },
						}}
					>
						<img
							src={f.url}
							width="100%"
							style={{ objectFit: 'contain' }}
						/>
						<Box className="actions">
							{!!i && (
								<Box
									position="absolute"
									left={0}
									bottom={0}
								>
									<IconButton onClick={() => onLeftClick(i)}>
										<ArrowLeftIcon/>
									</IconButton>
								</Box>
							)}
							{i !== (images.length - 1) && (
								<Box
									position="absolute"
									right={0}
									bottom={0}
								>
									<IconButton onClick={() => onRightClick(i)}>
										<ArrowRightIcon/>
									</IconButton>
								</Box>
							)}
							<Box
								position="absolute"
								right={0}
								top={0}
							>
								<IconButton onClick={() => onDelete(f)}>
									<DeleteIcon />
								</IconButton>
							</Box>
						</Box>
					</Box>
				</Grid>
			))}
		</Grid>
	);
}
