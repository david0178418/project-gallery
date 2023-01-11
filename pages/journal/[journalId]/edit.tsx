import Head from 'next/head';
import { useRouteBackDefault } from '@common/hooks';
import { ScrollContent } from '@components/scroll-content';
import { BackIcon, SaveIcon } from '@components/icons';
import { GetServerSideProps } from 'next';
import { getServerSession } from '@server/auth-options';
import { fetchJournal } from '@server/queries';
import { dbJournalToUiJournal, uiJournalToWriteJournal } from '@server/transforms';
import { MongoIdValidation } from '@server/validations';
import { UiJournal } from '@common/types/Journal';
import EditJournalForm, { journalIsPublishable, journalIsValid } from '@components/forms/edit-journal.form';
import { CancelButton, ConfirmButton } from '@components/common/buttons';
import { useSetAtom } from 'jotai';
import { loadingAtom, pushToastMsgAtom } from '@common/atoms';
import { journalSave } from '@client/api-calls';
import { useState } from 'react';
import {
	AppName,
	SpecialCharacterCodes,
} from '@common/constants';
import {
	Box,
	IconButton,
	Typography,
	useMediaQuery,
	useTheme,
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
	const { journal: defaultJournal	} = props;
	const [journal, setJournal] = useState(() => defaultJournal && uiJournalToWriteJournal(defaultJournal));
	const routeBack = useRouteBackDefault();
	const setLoading = useSetAtom(loadingAtom);
	const pushToastMsg = useSetAtom(pushToastMsgAtom);
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const title = `${defaultJournal?.title} - Edit` || 'Not Found';

	async function handleSave(publish = false) {
		if(!journal) {
			return null;
		}

		try {
			setLoading(true);
			await journalSave({
				...journal,
				publish: journal.publish || publish,
			});
			close();
		} catch(e: any) {
			const { errors = ['Something went wrong. Try again.'] } = e;

			errors.map(pushToastMsg);
			console.log(e);
		}

		setLoading(false);
		routeBack();
	}

	return (
		<>
			<Head>
				<title>{`${AppName} - ${title}`}</title>
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
							{title}
						</Typography>
					</Box>
				}
			>
				{journal && (
					<EditJournalForm
						journal={journal}
						onChange={setJournal}
					/>
				)}
				<Box paddingTop={2} textAlign="right">
					<CancelButton
						fullWidth={fullScreen}
						onClick={routeBack}
					/>
					{!journal?.publish && (
						<Box
							sx={{
								display: {
									xs: 'block',
									md: 'inline-block',
								},
								paddingLeft: { md: 2 },
								paddingTop: {
									xs: 2,
									md: 0,
								},
								paddingBottom: 20,
							}}
						>
							<ConfirmButton
								onClick={() => handleSave()}
								fullWidth={fullScreen}
								disabled={!(journal && journalIsValid(journal))}
								endIcon={<SaveIcon/>}
							>
								Save
							</ConfirmButton>
						</Box>
					)}
					<Box
						sx={{
							display: {
								xs: 'block',
								md: 'inline-block',
							},
							paddingLeft: { md: 2 },
							paddingTop: {
								xs: 2,
								md: 0,
							},
							paddingBottom: 20,
						}}
					>
						<ConfirmButton
							onClick={() => handleSave(true)}
							fullWidth={fullScreen}
							disabled={!(journal && journalIsPublishable(journal))}
							variant="contained"
						>
							{journal?.publish ? 'Update' : 'Publish'}
						</ConfirmButton>
					</Box>
				</Box>
			</ScrollContent>
		</>
	);
}
