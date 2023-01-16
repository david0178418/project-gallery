import { red } from '@mui/material/colors';
import { ExpandedToggleButton } from '@components/expand-toggle-button';
import { useState } from 'react';
import { localizedDateFormat } from '@common/utils';
import { UiProject } from '@common/types/Project';
import { ParsedContent } from './parsed-content';
import Link from 'next/link';
import { Paths } from '@common/constants';
import { useUser } from '@common/hooks';
import {
	ShareIcon,
	FavoriteIcon,
	JournalIcon,
	EditIcon,
} from '@components/icons';
import {
	Avatar,
	Box,
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
	const user = useUser();
	const {
		project: {
			_id,
			description,
			projectCreatedDate,
			lastJournalEntry,
			lastUpdatedDate,
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
						{localizedDateFormat(projectCreatedDate)}<br/>
						{lastUpdatedDate && ( // TODO This conditional may no longer be needed
							<>
								updated: {localizedDateFormat(lastUpdatedDate)}
							</>
						)}
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
			<Box>
				<Link href={Paths.Project(_id)}>
					<CardMedia
						component="img"
						height="194"
						image={images?.[0].url}
					/>
				</Link>
			</Box>
			<CardContent>
				<Typography variant="body2" color="text.secondary">
					<ParsedContent>
						{description}
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
							{description}
						</ParsedContent>
					</Typography>
				</CardContent>
			</Collapse>
		</Card>
	);
}
