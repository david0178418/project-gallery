import { DbProject, UiProject } from '@common/types/Project';
import { ParsedContent } from './parsed-content';
import Link from 'next/link';
import { Paths } from '@common/constants';
import { ShareIconButton } from './common/share-button';
import {
	FavoriteIcon,
	JournalIcon,
	EditIcon,
} from '@components/icons';
import {
	Box,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	IconButton,
	Tooltip,
	Typography,
} from '@ui';

interface Props {
	project: DbProject | UiProject;
	isOwner?: boolean;
}

export default
function ProjectCard(props: Props) {
	const {
		isOwner,
		project: {
			_id,
			description,
			lastJournalEntry,
			title,
			images,
			owner: { username },
		},
	} = props;
	const projectUrl = Paths.Project(_id.toString());

	return (
		<Card elevation={4}>
			<Box>
				<Link href={projectUrl}>
					<CardMedia
						component="img"
						image={images?.[0].url}
						sx={{ aspectRatio: '4 / 3' }}
					/>
				</Link>
			</Box>
			<CardContent>
				<Typography variant="h6" component="div">
					{title}
				</Typography>
				<Typography fontSize={12} fontStyle="italic">
					created by {username}
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					height={50}
					overflow="hidden"
					sx={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }}
				>
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
				<ShareIconButton
					label={title}
					url={projectUrl}
					shareMsg="Check out this project!"
				/>
				{lastJournalEntry && (
					<Link
						shallow
						href={Paths.Journal(lastJournalEntry._id.toString())}
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
						href={Paths.ProjectEdit(_id.toString())}
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
