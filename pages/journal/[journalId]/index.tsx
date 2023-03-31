import Head from 'next/head';
import { useRouteBackDefault, useUser } from '@common/hooks';
import { ScrollContent } from '@components/scroll-content';
import { BackIcon, EditIcon } from '@components/icons';
import { GetServerSideProps } from 'next';
import { getServerSession } from '@server/auth-options';
import { fetchJournal } from '@server/queries';
import { dbJournalToUiJournal } from '@server/transforms';
import { MongoIdValidation } from '@server/validations';
import Link from 'next/link';
import { UiJournal } from '@common/types/Journal';
import MarkdownContent from '@components/markdown-content';
import { ArticleJsonLd, NextSeo } from 'next-seo';
import {
	AppName,
	BaseUrl,
	Paths,
	SpecialCharacterCodes,
} from '@common/constants';
import {
	Box,
	Fab,
	IconButton,
	Link as MuiLink,
	Typography,
} from '@mui/material';
import { LocalizedDate } from '@components/localized-date';
import { urlJoin } from '@common/utils';

interface Props {
	journal: UiJournal | null;
}

export
const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
	const result = await MongoIdValidation.safeParseAsync(ctx.query.journalId);
	const session = await getServerSession(ctx.req, ctx.res);

	if(!result.success) {
		return {
			props: {
				session,
				journal: null,
			},
		};
	}

	const id = result.data;
	const journal = await fetchJournal(id);

	return {
		props: {
			session,
			journal: journal && dbJournalToUiJournal(journal),
		},
	};
};

export default
function Journal(props: Props) {
	const routeBack = useRouteBackDefault();
	const user = useUser();
	const { journal	} = props;
	const isOwner = !!journal && user?.id === journal.owner._id;
	const url = journal ?
		urlJoin(BaseUrl, Paths.Journal(journal._id)) :
		'';
	const description = journal ?
		journal.body.slice(0, 300) :
		'';
	const title = journal ?
		`${journal.title} - ${AppName}` :
		'';

	return (
		<>
			{journal && (
				<>
					<Head>
						<title>{`${journal?.title || '???'} - ${AppName}`}</title>
					</Head>
					<NextSeo
						openGraph={{
							url,
							siteName: AppName,
							title,
							description,
						}}
						twitter={{ cardType: 'summary' }}
					/>
					<ArticleJsonLd
						type="BlogPosting"
						url={url}
						title={journal.title}
						images={[]}
						datePublished={journal.publishedDate || ''}
						dateModified={journal.lastUpdatedDate || ''}
						authorName={journal.owner.username}
						description={description}
					/>
				</>
			)}
			<ScrollContent
				header={
					<Box sx={{
						paddingTop: 1,
						paddingBottom: 2,
					}}>
						<Typography variant="h5" component="div" gutterBottom>
							{/** TODO Capture direct links and send them to home page */}
							<IconButton color="primary" onClick={routeBack}>
								<BackIcon />
							</IconButton>{SpecialCharacterCodes.NBSP}
							{journal?.title || 'Not Found'}
						</Typography>
					</Box>
				}
			>
				{journal && (
					<>
						<Typography variant="subtitle2">
							<Link href={Paths.UserGallery(journal.owner.username)} passHref legacyBehavior>
								<MuiLink>
									By {journal.owner.username}
								</MuiLink>
							</Link>
						</Typography>
						{!!journal.project && (
							<Link href={Paths.Project(journal.project._id)} passHref legacyBehavior>
								<MuiLink>
									<Typography variant="subtitle2">
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
					</>
				)}
			</ScrollContent>
			{isOwner && (
				<Link
					legacyBehavior
					href={Paths.JournalEdit(journal._id)}
				>
					<Fab
						color="primary"
						sx={{
							position: 'absolute',
							bottom: 64,
							right: 16,
						}}
					>
						<EditIcon/>
					</Fab>
				</Link>
			)}
		</>
	);
}
