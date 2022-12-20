import { ShareIcon } from '@components/icons';
import { red } from '@mui/material/colors';
import { ExpandedToggleButton } from '@components/expand-toggle-button';
import { FavoriteBorder } from '@mui/icons-material';
import { useState } from 'react';
import { localizedDateFormat } from '@common/utils';
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
function PorjectCard(props: any) {
	const [expanded, setExpanded] = useState(false);
	const {
		title,
		created,
		summary,
		detail,
		titleImageUrl,
	} = props;

	function handleExpandClick() {
		setExpanded(!expanded);
	}

	return (
		<Card elevation={2}>
			<CardHeader
				title={title}
				subheader={localizedDateFormat(created)}
				avatar={
					<Avatar sx={{ bgcolor: red[500] }}>
						F
					</Avatar>
				}
			/>
			<CardMedia
				component="img"
				height="194"
				image={titleImageUrl}
			/>
			<CardContent>
				<Typography variant="body2" color="text.secondary">
					{summary}
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
					<Typography paragraph>
						{detail}
					</Typography>
				</CardContent>
			</Collapse>
		</Card>
	);
}
