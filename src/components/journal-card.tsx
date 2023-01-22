import { red } from '@mui/material/colors';
import { localizedDateFormat } from '@common/utils';
import { UiJournal } from '@common/types/Journal';
import Link from 'next/link';
import { Paths } from '@common/constants';
import { useUser } from '@common/hooks';
import MarkdownContent from './markdown-content';
import {
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
import { ShareIconButton } from './common/share-button';

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
					<Link href={journalUrl}>
						{title}
					</Link>
				}
				subheader={(
					<Link href={journalUrl}>
						{publishedDate && localizedDateFormat(publishedDate)}
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
						maxHeight: 40,
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
