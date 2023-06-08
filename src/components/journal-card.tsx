'use client';
import { red } from '@mui/material/colors';
import { UiJournal } from '@common/types/Journal';
import Link from 'next/link';
import { Paths } from '@common/constants';
import { useUser } from '@common/hooks';
import MarkdownContent from './markdown-content';
import { ShareIconButton } from './common/share-button';
import { LocalizedDate } from './localized-date';
import {
	FavoriteIcon,
	EditIcon,
} from '@components/icons';
import {
	Avatar,
	Box,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	IconButton,
	Tooltip,
	Typography,
} from '@ui';

interface Props {
	journal: UiJournal;
}

export default
function JournalCard(props: Props) {
	const user = useUser();
	const {
		journal: {
			_id,
			body,
			title,
			publishedDate,
			project,
			owner: {
				_id: ownerId,
				username,
			},
		},
	} = props;
	const isOwner = user?.id === ownerId;
	const journalUrl = Paths.Journal(_id);

	return (
		<Card elevation={2}>
			<CardHeader
				title={
					<Box sx={{ ':hover': { textDecoration: 'underline' } } }>
						<Link href={journalUrl}>
							{title}
						</Link>
					</Box>
				}
				subheader={(
					<Link href={journalUrl}>
						{publishedDate && (
							<LocalizedDate date={publishedDate} />
						)}
					</Link>
				)}
				avatar={
					<Link href={Paths.UserGallery(username)}>
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
			<CardContent>
				{project && (
					<Box sx={{ ':hover': { textDecoration: 'underline' } } }>
						<Link href={Paths.Project(project._id)}>
							<Typography variant="subtitle1">
								Project: {project.title}
							</Typography>
						</Link>
					</Box>
				)}
				{!project && (
					<Typography variant="subtitle2">
						Personal Post
					</Typography>
				)}
				<Typography
					component="div"
					variant="body2"
					color="text.secondary"
					sx={{
						height: 55,
						overflow: 'hidden',
						maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
					}}
				>
					<MarkdownContent plaintext>
						{body}
					</MarkdownContent>
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
						url={Paths.Journal(_id)}
						label={title}
						shareMsg="Check out this project journal post!"
					/>
				</Tooltip>
				{isOwner && (
					<Link href={Paths.JournalEdit(_id)}>
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
