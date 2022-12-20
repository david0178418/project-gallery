import { ShareIcon } from '@components/icons';
import { red } from '@mui/material/colors';
import { ExpandedToggleButton } from '@components/expand-toggle-button';
import { FavoriteBorder } from '@mui/icons-material';
import { useState } from 'react';
import { random } from '@common/utils';
import {
	Avatar,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	CardMedia,
	Collapse,
	IconButton,
	Typography,
} from '@mui/material';

export default
function PorjectCard() {
	const [expanded, setExpanded] = useState(false);
	const [dummyImgNum] = useState(() => random(0, 9));

	function handleExpandClick() {
		setExpanded(!expanded);
	}

	return (
		<Card
			elevation={2}
		>
			<CardHeader
				avatar={
					<Avatar sx={{ bgcolor: red[500] }}>
						R
					</Avatar>
				}
				title="Shrimp and Chorizo Paella"
				subheader="September 14, 2016"
			/>
			<CardMedia
				component="img"
				height="194"
				image={`https://placebacon.net/400/300?image=${dummyImgNum}`}
				alt="Paella dish"
			/>
			<CardContent>
				<Typography variant="body2" color="text.secondary">
					This impressive paella is a perfect party dish and a fun meal to cook
					together with your guests. Add 1 cup of frozen peas along with the mussels,
					if you like.
				</Typography>
			</CardContent>
			<CardActions disableSpacing>
				<IconButton>
					<FavoriteBorder />
				</IconButton>
				<IconButton>
					<ShareIcon />
				</IconButton>
				<ExpandedToggleButton
					expanded={expanded}
					onClick={handleExpandClick}
				/>
			</CardActions>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<CardContent>
					<Typography paragraph>Method:</Typography>
					<Typography paragraph>
						Heat 1/2 cup of the broth in a pot until simmering, add saffron and set
						aside for 10 minutes.
					</Typography>
					<Typography paragraph>
						Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over
						medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring
						occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a
						large plate and set aside, leaving chicken and chorizo in the pan. Add
						pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook,
						stirring often until thickened and fragrant, about 10 minutes. Add
						saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
					</Typography>
					<Typography paragraph>
						Add rice and stir very gently to distribute. Top with artichokes and
						peppers, and cook without stirring, until most of the liquid is absorbed,
						15 to 18 minutes. Reduce heat to medium-low, add reserved shrimp and
						mussels, tucking them down into the rice, and cook again without
						stirring, until mussels have opened and rice is just tender, 5 to 7
						minutes more. (Discard any mussels that don&apos;t open.)
					</Typography>
					<Typography>
						Set aside off of the heat to let rest for 10 minutes, and then serve.
					</Typography>
				</CardContent>
			</Collapse>
		</Card>
	);
}
