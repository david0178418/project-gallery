import Head from 'next/head';
import { useRouteBackDefault } from '@common/hooks';
import { ScrollContent } from '@components/scroll-content';
import { BackIcon } from '@components/icons';
import { GetServerSideProps } from 'next';
import { getServerSession } from '@server/auth-options';
import { fetchJournal } from '@server/queries';
import { dbJournalToUiJournal } from '@server/transforms';
import { MongoIdValidation } from '@server/validations';
import { localizedDateFormat } from '@common/utils';
import Link from 'next/link';
import { UiJournal } from '@common/types/Journal';
import {
	AppName,
	Paths,
	SpecialCharacterCodes,
} from '@common/constants';
import {
	Box,
	IconButton,
	Link as MuiLink,
	Typography,
} from '@mui/material';

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
	const { journal	} = props;

	return (
		<>
			<Head>
				<title>{AppName}</title>
			</Head>
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
									localizedDateFormat(journal.publishedDate) :
									'Unpublished'
							}<br/>
						</Typography>
						{journal.lastUpdatedDate && (
							<Typography variant="subtitle1" fontStyle="italic">
								last updated: {localizedDateFormat(journal.lastUpdatedDate)}
							</Typography>
						)}
						<Typography paddingTop={2}>
							{journal.body}
						</Typography>
					</>
				)}
			</ScrollContent>
		</>
	);
}
