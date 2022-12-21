import { LoginModal } from '@components/modals/login.modal';
import { LogoutModal } from '@components/modals/logout.modal';
import { Loader } from '@components/loader';
import { Toast } from '@components/toast';
import { CreateProjectModal } from '@components/modals/create-project.modal';

export
function CommonStuff() {
	return (
		<>
			<LogoutModal />
			<LoginModal />
			<CreateProjectModal/>
			<Toast />
			<Loader />
		</>
	);
}

export default CommonStuff;
