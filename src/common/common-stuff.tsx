import LoginModal from '@components/modals/login.modal';
import LogoutModal from '@components/modals/logout.modal';
import Loader from '@components/loader';
import Toast from '@components/toast';
import CreateProjectModal from '@components/modals/create-project.modal';
import CreateJournalModal from '@components/modals/create-journal.modal';

export default
function CommonStuff() {
	return (
		<>
			<LogoutModal />
			<LoginModal />
			<CreateProjectModal/>
			<CreateJournalModal/>
			<Toast />
			<Loader />
		</>
	);
}
