import Head from 'next/head';
import { useRouteBackDefault } from '@common/hooks';
import { ScrollContent } from '@components/scroll-content';
import { BackIcon } from '@components/icons';
import { GetServerSideProps } from 'next';
import { UsernameValidation } from '@common/types/UserCredentials';
import { getServerSession } from '@server/auth-options';
import { fetchUserJournals } from '@server/queries';
import { dbJournalToUiJournal } from '@server/transforms';
import { UiJournal } from '@common/types/Journal';
import Link from 'next/link';
import {
	AppName,
	Paths,
	SpecialCharacterCodes,
} from '@common/constants';
import {
	Box,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Typography,
} from '@mui/material';

interface Props {
	unknownUser?: boolean;
	username: string;
	journals: UiJournal[];
}

export
const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
	const result = await UsernameValidation.safeParseAsync(ctx.query.username);
	const session = await getServerSession(ctx.req, ctx.res);

	if(!result.success) {
		return {
			props: {
				session,
				username: 'unknown',
				unknownUser: true,
				journals: [],
			},
		};
	}

	const username = result.data;
	const isOwner = !!username && (username === session?.user.username);
	const dbJournals = await fetchUserJournals(username, isOwner) || [];

	return {
		props: {
			session,
			username,
			journals: dbJournals.map(dbJournalToUiJournal),
		},
	};
};

export default
function UserJournals(props: Props) {
	const routeBack = useRouteBackDefault();
	const {
		username,
		journals,
	} = props;

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
							{username}{SpecialCharacterCodes.RSQUO}s Journals
						</Typography>
					</Box>
				}
			>
				{journals.map(j => (
					<List key={j._id}>
						<ListItem>
							<Link passHref legacyBehavior href={Paths.Journal(j._id)}>
								<ListItemButton>
									<ListItemText
										primary={j.title}
										secondary={j.project && `Project: ${j.project?.title}`}
									/>
								</ListItemButton>
							</Link>
						</ListItem>
					</List>
				))}
			</ScrollContent>
		</>
	);
}
