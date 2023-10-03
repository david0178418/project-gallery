import { getServerSession } from '@server/auth-options';
import { fetchJournal, fetchProjectsByUser } from '@server/queries';
import { MongoIdValidation } from '@server/validations';
import { Typography } from '@ui';
import { pick } from '@/common/utils';
import EditJournalForm from './edit-journal-form';
import { DbJournal, WriteJournal } from '@common/types/Journal';
import { dbProjectToUiProject } from '@server/transforms';

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

	if(journal.owner._id.toString() !== session?.user.id) {
		return (
			<Typography>
				Not allowed to edit.
			</Typography>
		);
	}

	const projects = await fetchProjectsByUser(session.user.id);

	return (
		<EditJournalForm
			journal={uiJournalToWriteJournal(journal)}
			projects={projects.map(dbProjectToUiProject)}
		/>
	);
}

function uiJournalToWriteJournal(project: DbJournal): WriteJournal {
	return {
		...pick(project, 'title', 'body'),
		projectId: project.project?._id.toString(),
		publish: !!project.publishedDate,
		_id: project._id.toString(),
	};
}
