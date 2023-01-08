import { red } from '@mui/material/colors';
import { localizedDateFormat } from '@common/utils';
import { UiJournal } from '@common/types/Journal';
import Link from 'next/link';
import { Paths } from '@common/constants';
import { useUser } from '@common/hooks';
import MarkdownContent from './markdown-content';
import {
	ShareIcon,
	FavoriteIcon,
	EditIcon,
} from '@components/icons';
import {
	Avatar,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	IconButton,
	Tooltip,
	Typography,
} from '@mui/material';

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

	return (
		<Card elevation={2}>
			<CardHeader

				title={
					<Link href={Paths.Journal(_id)}>
						{title}
					</Link>
				}
				subheader={(
					<Link href={Paths.Journal(_id)}>
						created: {publishedDate && localizedDateFormat(publishedDate)}
					</Link>
				)}
				avatar={
					<Link href={Paths.UserJournals(username)}>
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
					<Link href={Paths.Project(project._id)}>
						<Typography variant="subtitle2">
							Project: {project.title}
						</Typography>
					</Link>
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
						height: 100,
						overflow: 'hidden',
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
					<IconButton>
						<ShareIcon />
					</IconButton>
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
