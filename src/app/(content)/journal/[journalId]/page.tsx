import { EditIcon } from '@components/icons';
import { getServerSession } from '@server/auth-options';
import { fetchJournal, fetchUserProfileByUsername } from '@server/queries';
import { MongoIdValidation } from '@server/validations';
import MarkdownContent from '@components/markdown-content';
import { LocalizedDate } from '@components/localized-date';
import { urlJoin } from '@common/utils';
import { Metadata } from 'next';
import { red } from '@mui/material/colors';
import Link from 'next/link';
import {
	AppName,
	BaseUrl,
	Paths,
} from '@common/constants';
import {
	Avatar,
	Box,
	Fab,
	Link as MuiLink,
	Typography,
} from '@ui';

export
async function generateMetadata(props: Props): Promise<Metadata> {
	const { params: { journalId } } = props;

	const result = await MongoIdValidation.safeParseAsync(journalId);
	const journal = result.success ?
		await fetchJournal(journalId) :
		null;

	if(!journal) {
		return {};
	}

	return {
		openGraph: {
			type: 'article',
			url: urlJoin(BaseUrl, Paths.Journal(journalId)),
			images: [],
			publishedTime: journal.publishedDate || '',
			modifiedTime: journal.lastUpdatedDate || '',
			authors: journal.owner.username,
		},
		title: `${journal.title} - ${AppName}`,
		description: journal.body.slice(0, 300),
		twitter: { card: 'summary' },
	};
}

interface Props {
	params: {
		journalId: string;
	};
}

export default
async function Journal(props: Props) {
	const { params: { journalId } } = props;

	const result = await MongoIdValidation.safeParseAsync(journalId);
	const journal = result.success ?
		await fetchJournal(journalId) :
		null;

	if(!journal) {
		return (
			<Typography>
				Invalid Journal
			</Typography>
		);
	}

	const session = await getServerSession();
	const isOwner = journal.owner._id.toString() === session?.user.id;
	const profile = await fetchUserProfileByUsername(journal.owner.username);

	return (
		<>
			<Typography variant="subtitle2">
				<Link
					href={Paths.UserGallery(journal.owner.username)}
					style={{ textDecoration: 'none' }}
				>
					<Avatar src={profile?.avatar} sx={{ bgcolor: red[500] }}>
						{journal.owner.username[0].toLocaleUpperCase()}
					</Avatar>
				</Link>
				<Link passHref href={Paths.UserGallery(journal.owner.username)}>
					<MuiLink>
						By {journal.owner.username}
					</MuiLink>
				</Link>
			</Typography>
			{!!journal.project && (
				<Link passHref href={Paths.Project(journal.project._id.toString())}>
					<MuiLink>
						<Typography variant="subtitle2" color="inherit">
								For Project: {journal.project.title}
						</Typography>
					</MuiLink>
				</Link>
			)}
			<Typography variant="subtitle1" paddingTop={1} fontStyle="italic">
						published: {
					journal.publishedDate ?
						<LocalizedDate date={journal.publishedDate} /> :
						'Unpublished'
				}<br/>
			</Typography>
			{journal.lastUpdatedDate && (
				<Typography variant="subtitle1" fontStyle="italic">
							last updated: <LocalizedDate date={journal.lastUpdatedDate} />
				</Typography>
			)}
			<Box paddingTop={2}>
				<MarkdownContent>
					{journal.body}
				</MarkdownContent>
			</Box>
			{isOwner && (
				<Link href={Paths.JournalEdit(journalId)}>
					<Fab
						color="primary"
						sx={{
							position: 'fixed',
							bottom: 64,
							right: 16,
						}}
					>
						<EditIcon />
					</Fab>
				</Link>
			)}
		</>
	);
}
