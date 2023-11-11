import { EditIcon } from '@components/icons';
import { getServerSession } from '@server/auth-options';
import { fetchJournal, fetchUserProfileByUsername } from '@server/queries';
import { MongoIdValidation } from '@server/validations';
import MarkdownContent from '@components/markdown-content';
import { LocalizedDate } from '@components/localized-date';
import { urlJoin } from '@common/utils';
import { Metadata } from 'next';
import Link from 'next/link';
import Fab from '@/components/common/fab';
import {
	Avatar,
	AvatarImage,
	AvatarFallback,
} from '@/components/ui/avatar';
import {
	AppName,
	BaseUrl,
	Paths,
} from '@common/constants';

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
			<div>
				Invalid Journal
			</div>
		);
	}

	const session = await getServerSession();
	const isOwner = journal.owner._id.toString() === session?.user.id;
	const profile = await fetchUserProfileByUsername(journal.owner.username);

	return (
		<>
			<div className="text-sm">
				<Link
					href={Paths.UserGallery(journal.owner.username)}
					style={{ textDecoration: 'none' }}
				>
					<Avatar className="bg-red-500">
						<AvatarImage src={profile?.avatar} />
						<AvatarFallback>
							{journal.owner.username[0].toLocaleUpperCase()}
						</AvatarFallback>
					</Avatar>
				</Link>
				<Link href={Paths.UserGallery(journal.owner.username)}>
					By {journal.owner.username}
				</Link>
			</div>
			{!!journal.project && (
				<Link href={Paths.Project(journal.project._id.toString())}>
					<div className="text-sm">
						For Project: {journal.project.title}
					</div>
				</Link>
			)}
			<div className="text-sm pt-1 italic">
						published: {
					journal.publishedDate ?
						<LocalizedDate date={journal.publishedDate} /> :
						'Unpublished'
				}<br/>
			</div>
			{journal.lastUpdatedDate && (
				<div className="text-sm pt-1 italic">
							last updated: <LocalizedDate date={journal.lastUpdatedDate} />
				</div>
			)}
			<div className="pt-2">
				<MarkdownContent>
					{journal.body}
				</MarkdownContent>
			</div>
			{isOwner && (
				<Link href={Paths.JournalEdit(journalId)}>
					<Fab className="bg-blue-500 absolute bottom-20 right-20">
						<EditIcon />
					</Fab>
				</Link>
			)}
		</>
	);
}
