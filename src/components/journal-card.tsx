import { red } from '@mui/material/colors';
import { DbJournal } from '@common/types/Journal';
import Link from 'next/link';
import { Paths } from '@common/constants';
import MarkdownContent from './markdown-content';
import { ShareIconButton } from './common/share-button';
import { LocalizedDate } from './localized-date';
import { fetchUserProfileByUsername } from '@server/queries';
import { FavoriteIcon } from '@components/icons';
import { Suspense } from 'react';
import EditButton from './edit-button.server';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

interface Props {
	journal: DbJournal;
}

export default
async function JournalCard(props: Props) {
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
	const profile = await fetchUserProfileByUsername(username);
	const journaId = _id.toString();
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
							<Avatar src={profile?.avatar} sx={{ bgcolor: red[500] }}>
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
				<Suspense>
					<EditButton
						userId={ownerId.toString()}
						href={Paths.JournalEdit(journaId)}
					/>
				</Suspense>
			</CardActions>
		</Card>
	);
}
