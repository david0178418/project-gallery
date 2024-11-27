import { getServerSession } from '@server/auth-options';
import { fetchJournal, fetchProjectsByUser } from '@server/queries';
import { MongoIdValidation } from '@server/validations';
import Typography from '@mui/material/Typography';
import { pick } from '@/common/utils';
import EditJournalForm from './edit-journal-form';
import { DbJournal, WriteJournal } from '@common/types/Journal';
import { dbProjectToUiProject } from '@server/transforms';
import { Alert } from '@mui/material';

export const experimental_ppr = false;

interface Props {
	params: Promise<{
		journalId?: string;
	}>;
}

export default
async function JournalEditPage(props: Props) {
	const { journalId } = await props.params;

	const journal = journalId ?
		await validateAndFetchJournal(journalId) :
		newWriteJournal();

	if(!journal) {
		return (
			<Typography>
				Invalid Journal
			</Typography>
		);
	}

	const session = await getServerSession();

	if(!session || ('owner' in journal && journal.owner._id.toString() !== session.user.id)) {
		return (
			<Typography>
				Not allowed to edit.
			</Typography>
		);
	}

	const projects = await fetchProjectsByUser(session.user.id);

	return (
		<>

			<Alert severity="info">
				Pardon our dust.  This page is in the middle of a rework.
			</Alert>
			<EditJournalForm
				projects={projects.map(dbProjectToUiProject)}
				journal={
					'owner' in journal ?
						dbJournalToWriteJournal(journal) :
						journal
				}
			/>
		</>
	);
}

function dbJournalToWriteJournal(project: DbJournal): WriteJournal {
	return {
		...pick(project, 'title', 'body'),
		projectId: project.project?._id.toString(),
		publish: !!project.publishedDate,
		_id: project._id.toString(),
	};
}

function newWriteJournal(): WriteJournal {
	return {
		title: '',
		body: '',
	};
}

async function validateAndFetchJournal(journalId: string): Promise<DbJournal | null> {
	const result = await MongoIdValidation.safeParseAsync(journalId);

	return result.success ?
		await fetchJournal(journalId) :
		null;
}
