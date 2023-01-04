import { red } from '@mui/material/colors';
import { ExpandedToggleButton } from '@components/expand-toggle-button';
import { useState } from 'react';
import { localizedDateFormat } from '@common/utils';
import { UiProject } from '@common/types/Project';
import { ParsedContent } from './parsed-content';
import Link from 'next/link';
import { Paths } from '@common/constants';
import {
	ShareIcon,
	FavoriteIcon,
	JournalIcon,
	EditIcon,
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
import { useUser } from '@common/hooks';

interface Props {
	project: UiProject;
}

export default
function ProjectCard(props: Props) {
	const [expanded, setExpanded] = useState(false);
	const user = useUser();
	const {
		project: {
			_id,
			detail,
			projectCreatedDate,
			projectLastUpdatedDate,
			lastJournalEntry,
			summary,
			title,
			images,
			owner: {
				_id: ownerId,
				username,
			},
		},
	} = props;
	const isOwner = user?.id === ownerId;

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
						href={Paths.UserGallery(username)}
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
			<Link href={Paths.Project(_id)}>
				<CardMedia
					component="img"
					height="194"
					image={images?.[0].url}
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
				{lastJournalEntry && (
					<Link
						shallow
						href={Paths.Journal(lastJournalEntry._id)}
					>
						<Tooltip
							arrow
							disableFocusListener
							disableTouchListener
							title={lastJournalEntry.title}
						>
							<IconButton>
								<JournalIcon />
							</IconButton>
						</Tooltip>
					</Link>
				)}
				{isOwner && (
					<Link
						shallow
						href={Paths.ProjectEdit(_id)}
					>
						<Tooltip
							arrow
							disableFocusListener
							disableTouchListener
							title="Edit"
						>
							<IconButton>
								<EditIcon />
							</IconButton>
						</Tooltip>
					</Link>
				)}
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
