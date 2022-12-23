import { red } from '@mui/material/colors';
import { ExpandedToggleButton } from '@components/expand-toggle-button';
import { useState } from 'react';
import { localizedDateFormat, urlJoin } from '@common/utils';
import { UiProject } from '@common/types/Project';
import { ParsedContent } from './parsed-content';
import Link from 'next/link';
import { Paths } from '@common/constants';
import {
	ShareIcon,
	FavoriteIcon,
	JournalIcon,
} from '@components/icons';
import {
	Avatar,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	CardMedia,
	Collapse,
	IconButton,
	Tooltip,
	Typography,
} from '@mui/material';

interface Props {
	project: UiProject;
}

export default
function ProjectCard(props: Props) {
	const [expanded, setExpanded] = useState(false);
	const {
		project: {
			_id,
			detail,
			projectCreatedDate,
			projectLastUpdatedDate,
			summary,
			title,
			titleImageUrl,
			owner: { username },
		},
	} = props;

	function handleExpandClick() {
		setExpanded(!expanded);
	}

	return (
		<Card elevation={2}>
			<CardHeader
				title={title}
				subheader={(
					<>
						created: {localizedDateFormat(projectCreatedDate)}<br/>
						last updated: {localizedDateFormat(projectLastUpdatedDate)}
					</>
				)}
				avatar={
					<Link
						shallow
						href={urlJoin(Paths.UserGallery, username)}
					>
						<Tooltip
							arrow
							disableFocusListener
							disableTouchListener
							title={username}
						>
							<Avatar sx={{ bgcolor: red[500] }}>
								{username[0].toLocaleUpperCase()}
							</Avatar>
						</Tooltip>
					</Link>
				}
			/>
			<Link href={urlJoin(Paths.Project, _id)}>
				<CardMedia
					component="img"
					height="194"
					image={titleImageUrl}
				/>
			</Link>
			<CardContent>
				<Typography variant="body2" color="text.secondary">
					<ParsedContent>
						{summary}
					</ParsedContent>
				</Typography>
			</CardContent>
			<CardActions disableSpacing>
				<Tooltip
					arrow
					disableFocusListener
					disableTouchListener
					title="Favorite"
				>
					<IconButton>
						<FavoriteIcon />
					</IconButton>
				</Tooltip>
				<Tooltip
					arrow
					disableFocusListener
					disableTouchListener
					title="Share"
				>
					<IconButton>
						<ShareIcon />
					</IconButton>
				</Tooltip>
				<Tooltip
					arrow
					disableFocusListener
					disableTouchListener
					title="Last Journal Entry"
				>
					<IconButton>
						<JournalIcon />
					</IconButton>
				</Tooltip>
				<ExpandedToggleButton
					sx={{ marginLeft: 'auto' }}
					expanded={expanded}
					onClick={handleExpandClick}
				/>
			</CardActions>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<CardContent>
					<Typography paragraph>
						<ParsedContent>
							{detail}
						</ParsedContent>
					</Typography>
				</CardContent>
			</Collapse>
		</Card>
	);
}
