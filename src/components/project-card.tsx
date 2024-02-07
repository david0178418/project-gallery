import { DbProject, UiProject } from '@common/types/Project';
import { ParsedContent } from './parsed-content';
import Link from 'next/link';
import { Paths } from '@common/constants';
import { ShareIconButton } from './common/share-button';
import { FavoriteIcon, JournalIcon } from '@components/icons';
import { Suspense } from 'react';
import EditButton from './edit-button.server';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

interface Props {
	project: DbProject | UiProject;
}

export default
async function ProjectCard(props: Props) {
	const {
		project: {
			_id,
			description,
			lastJournalEntry,
			title,
			images,
			owner,
		},
	} = props;
	const projectUrl = Paths.Project(_id.toString());

	return (
		<Card elevation={4}>
			{images?.[0]?.url && (
				<Box>
					<Link href={projectUrl}>
						<CardMedia
							component="img"
							image={images?.[0].url}
							sx={{ aspectRatio: '4 / 3' }}
						/>
					</Link>
				</Box>
			)}
			<CardContent>
				<Typography variant="h6" component="div">
					{title}
				</Typography>
				<Typography fontSize={12} fontStyle="italic">
					created by {owner.username}
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
				<Suspense>
					<EditButton
						userId={owner._id.toString()}
						href={Paths.ProjectEdit(_id.toString())}
					/>
				</Suspense>
			</CardActions>
		</Card>
	);
}
