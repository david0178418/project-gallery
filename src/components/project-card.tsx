import { red } from '@mui/material/colors';
import { localizedDateFormat } from '@common/utils';
import { UiProject } from '@common/types/Project';
import { ParsedContent } from './parsed-content';
import Link from 'next/link';
import { Paths } from '@common/constants';
import { useUser } from '@common/hooks';
import {
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
	IconButton,
	Tooltip,
	Typography,
} from '@mui/material';
import { ShareIconButton } from './common/share-button';

interface Props {
	project: UiProject;
}

export default
function ProjectCard(props: Props) {
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
	const projectUrl = Paths.Project(_id);

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
				<Link href={projectUrl}>
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
					<ShareIconButton
						label={title}
						url={projectUrl}
						shareMsg="Check out this project!"
					/>
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
			</CardActions>
		</Card>
	);
}
