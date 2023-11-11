import { getServerSession } from '@server/auth-options';
import { fetchJournal, fetchProjectsByUser } from '@server/queries';
import { MongoIdValidation } from '@server/validations';
import { pick } from '@/common/utils';
import EditJournalForm from './edit-journal-form';
import { DbJournal, WriteJournal } from '@common/types/Journal';
import { dbProjectToUiProject } from '@server/transforms';

interface Props {
	params: {
		journalId?: string;
	};
}

export default
async function JournalEditPage(props: Props) {
	const { params: { journalId } } = props;

	const journal = journalId ?
		await validateAndFetchJournal(journalId) :
		newWriteJournal();

	if(!journal) {
		return (
			<div>
				Invalid Journal
			</div>
		);
	}

	const session = await getServerSession();

	if(!session || ('owner' in journal && journal.owner._id.toString() !== session.user.id)) {
		return (
			<div>
				Not allowed to edit.
			</div>
		);
	}

	const projects = await fetchProjectsByUser(session.user.id);

	return (
		<EditJournalForm
			projects={projects.map(dbProjectToUiProject)}
			journal={
				'owner' in journal ?
					dbJournalToWriteJournal(journal) :
					journal
			}
		/>
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
