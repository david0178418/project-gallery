import { ShareIcon } from '@components/icons';
import { red } from '@mui/material/colors';
import { ExpandedToggleButton } from '@components/expand-toggle-button';
import { FavoriteBorder } from '@mui/icons-material';
import { useState } from 'react';
import { localizedDateFormat } from '@common/utils';
import { UiProject } from '@common/types/Project';
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

interface Props {
	project: UiProject;
}

export default
function PorjectCard(props: Props) {
	const [expanded, setExpanded] = useState(false);
	const { project } = props;

	function handleExpandClick() {
		setExpanded(!expanded);
	}

	return (
		<Card elevation={2}>
			<CardHeader
				title={project.title}
				subheader={(
					<>
						created: {localizedDateFormat(project.projectCreated)}<br/>
						last updated: {localizedDateFormat(project.projectLastUpdated)}
					</>
				)}
				avatar={
					<Avatar sx={{ bgcolor: red[500] }}>
						F
					</Avatar>
				}
			/>
			<CardMedia
				component="img"
				height="194"
				image={project.titleImageUrl}
			/>
			<CardContent>
				<Typography variant="body2" color="text.secondary">
					{project.summary}
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
						{project.detail}
					</Typography>
				</CardContent>
			</Collapse>
		</Card>
	);
}
