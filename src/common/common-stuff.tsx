import Loader from '@components/loader';
import Toast from '@components/toast';
import CreateProjectModal from '@components/modals/create-project.modal';
import CreateJournalModal from '@components/modals/create-journal.modal';

export default
function CommonStuff() {
	return (
		<>
			<CreateProjectModal/>
			<CreateJournalModal/>
			<Toast />
			<Loader />
		</>
	);
}
