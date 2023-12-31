import UserProjectsPage from './(projects)';
import UserAboutPage from './about';
import UserJournalsPage from './journals';

export
const ProfilePages = {
	projects: {
		label: 'Projects',
		Component: UserProjectsPage,
	},
	about: {
		label: 'About',
		Component: UserAboutPage,
	},
	journals: {
		label: 'Posts',
		Component: UserJournalsPage,
	},
};
