import { red } from '@mui/material/colors';
import { DbProject, UiProject } from '@common/types/Project';
import { ParsedContent } from './parsed-content';
import Link from 'next/link';
import { Paths } from '@common/constants';
import { ShareIconButton } from './common/share-button';
import Label from './label';
import { LocalizedDate } from './localized-date';
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
			projectCreatedDate,
			labels,
			lastJournalEntry,
			lastUpdatedDate,
			title,
			images,
			owner: { username },
		},
	} = props;
	const projectUrl = Paths.Project(_id.toString());

	return (
		<Card elevation={2}>
			<CardHeader
				title={title}
				subheader={(
					<>
						<LocalizedDate date={projectCreatedDate} /><br/>
						{lastUpdatedDate && ( // TODO This conditional may no longer be needed
							<>
								updated: <LocalizedDate date={(lastUpdatedDate)} />
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
						image={images?.[0].url}
						sx={{ aspectRatio: '4 / 3' }}
					/>
				</Link>
			</Box>
			<CardContent>
				<Typography
					variant="body2"
					color="text.secondary"
					height={80}
					overflow="hidden"
					sx={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }}
				>
					<ParsedContent>
						{description}
					</ParsedContent>
				</Typography>
				{!!labels.length && (
					<Box marginTop={2}>
						{labels.map((l, i) => (
							<Label
								key={i}
								label={l.label}
							/>
						))}
					</Box>
				)}
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
