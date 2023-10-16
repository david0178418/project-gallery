import { red } from '@mui/material/colors';
import { DbJournal } from '@common/types/Journal';
import Link from 'next/link';
import { Paths } from '@common/constants';
import MarkdownContent from './markdown-content';
import { ShareIconButton } from './common/share-button';
import { LocalizedDate } from './localized-date';
import { getServerSession } from '@server/auth-options';
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
	journal: DbJournal;
}

export default
async function JournalCard(props: Props) {
	const session = await getServerSession();
	const user = session?.user;
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
	const journaId = _id.toString();
	const isOwner = user?.id === ownerId.toString();
	const journalUrl = Paths.Journal(journaId);

	return (
		<Card elevation={2}>
			<CardHeader
				title={
					<Box sx={{ ':hover': { textDecoration: 'underline' } } }>
						<Link prefetch={false} href={journalUrl}>
							{title}
						</Link>
					</Box>
				}
				subheader={(
					<Link prefetch={false} href={journalUrl}>
						{publishedDate && (
							<LocalizedDate date={publishedDate} />
						)}
					</Link>
				)}
				avatar={
					<Link prefetch={false} href={Paths.UserGallery(username)}>
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
						<Link prefetch={false} href={Paths.Project(project._id.toString())}>
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
				<ShareIconButton
					url={Paths.Journal(journaId)}
					label={title}
					shareMsg="Check out this project journal post!"
				/>
				{isOwner && (
					<Link prefetch={false} href={Paths.JournalEdit(journaId)}>
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
