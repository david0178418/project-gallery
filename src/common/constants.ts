import { Enum } from './types';
import { urlJoin } from './utils';

export const BaseUrl = process.env.HOST || `http://localhost:${process.env.PORT}`;
export const IsDev = process.env.NODE_ENV !== 'production';
export const NoReplyEmailAddress = process.env.NO_REPLY_EMAIL_ADDRESS || '';
export const SmtpPort = +(process.env.SMTP_PORT || '25');
export const SmtpPw = process.env.SMTP_PW;
export const SmtpServer = process.env.SMTP_SERVER;
export const SmtpUsername = process.env.SMTP_USERNAME;

export const ApiUrl = '/api/v0';
export const AppName = 'ProjectGallery.me';
export const CookieName = AppName;
export const DefaultToastMsgDelay = 4000;
export const ExtendedWhitespaceRegex = /\s{2,}/g;
export const ISODateStringLength = 24;
export const IsSsr = typeof window === 'undefined';
export const MaxImageDescriptionLength = 200;
export const MaxImageUrlLength = 200;
export const MaxJournalPostLength = 4000;
export const MaxJournalProjectTitleLength = 100;
export const maxLabelCount = 5;
export const MaxLabelSize = 20;
export const MaxLinkLabelSize = 100;
export const MaxProjectDescriptionLength = 1000;
export const MaxSearchTermSize = 100;
export const MaxUserProfileBioLength = 4000;
export const MaxUserProfileShortBioLength = 160;
export const MinImageUrlLength = 50;
export const MinJournalPostLength = 10;
export const MinJournalProjectTitleLength = 3;
export const MinLabelSize = 1;
export const MinLinkLabelSize = 3;
export const MinProjectDescriptionLength = 10;
export const MongoIdLength = 24;
export const PasswordMaxLength = 128;
export const PasswordMinLength = 6;
export const PasswordSaltLength = 10;
export const UsernameMaxLength = 24;
export const UsernameMinLength = 3;
export const UserProfileTitleMaxLength = 32;
export const UserProfileTitleMinLength = 3;

export const AuthUser_tokensCookieName = `${CookieName}.AuthUserTokens`;
export const AuthUserCookieName = `${CookieName}.AuthUser`;

// Source: https://stackoverflow.com/questions/4328500/how-can-i-strip-all-punctuation-from-a-string-in-javascript-using-regex
export const PunctuationRegex = /[^\p{L}\s]/gu; // Not sure if this should be used or the other const PunctuationRegex = /[.,-/#!$%^&*;:{}""=\-_`~()@+?><[\]+]/g;

export
const BaseReq: RequestInit = {
	credentials: 'include',
	headers: {
		Accept: 'application/json, text/plain, */*',
		'Content-Type': 'application/json',
	},
} as const;

export
const Direction = {
	Left: 'left',
	Right: 'right',
} as const;

export
type DirectionEnum = Enum<typeof Direction>;

export
const DbCollections = {
	Grams: 'grams',
	Journals: 'journals',
	Projects: 'projects',
	UserGalleryOrder: 'user-gallery-order',
	UserProfiles: 'user-profiles',
	Users: 'users',
	UsersMeta: 'users-meta',
	UserOneClickLinkKeys: 'user-one-click-link-keys',
	SentEmails: 'sent-emails',
} as const;

export
const ProfileActivity = {
	JournalCreate: 'journal-create',
	JournalUpdate: 'journal-update',
	ProfileCreate: 'profile-create',
	ProfileUpdate: 'profile-update',
	ProjectCreate: 'project-create',
	ProjectUpdate: 'project-update',
} as const;

export type ProfileActivity = Enum<typeof ProfileActivity>;

export
const NotLoggedInErrMsg = {
	ok: false,
	msg: 'Not logged in',
};

export
const AuthProviders = {
	OneClick: 'one-click',
	Creds: 'creds',
} as const;

export
// TODO Does this still belong here?
const Paths = {
	Favorites: '/favorites',
	Galleries: '/galleries',
	Home: '/home',
	Journal: (journalId: string) => urlJoin('/journal', journalId),
	JournalEdit: (journalId = '') => urlJoin(Paths.Journal(journalId), 'edit'),
	UserLoginEmail: '/user/login/email',
	UserLoginPw: '/user/login/pw',
	UserRegister: '/user/register',
	OneClickAuth: '/one-click-auth/',
	Project: (projectId: string) => urlJoin('/project', projectId),
	ProjectAbout: (projectId: string) => urlJoin(Paths.Project(projectId), '/about'),
	ProjectEdit: (projectId = '') => urlJoin(Paths.Project(projectId), 'edit'),
	ProjectJournals: (projectId: string) => urlJoin(Paths.Project(projectId), '/journals'),
	ProjectLinks: (projectId: string) => urlJoin(Paths.Project(projectId), '/links'),
	Search: '/search',
	Settings: '/settings',
	SettingsUpdatePw: '/settings/update-pw',
	UserGallery: (username: string) => `/${username}`,
	UserGalleryEdit: (username: string) => urlJoin(Paths.UserGallery(username), '/edit'),
	UserGalleryProjects: (username: string) => urlJoin(Paths.UserGallery(username), '/projects'),
	UserGalleryJournals: (username: string) => urlJoin(Paths.UserGallery(username), '/journals'),
} as const;

export
const FileUploadCategories = {
	Profile: 'profile',
	Posts: 'posts',
	Journals: 'journals',
} as const;

export
const SpecialCharacterCodes = {
	NBSP: '\u00A0',
	DOT: '\u2022',
	QUOTE: '\u0022',
	RSQUO: '\u2019',
} as const;

export
// Source: https://99webtools.com/blog/list-of-english-stop-words/
const StopWords = [
	'a', 'able', 'about', 'across', 'after', 'all', 'almost', 'also', 'am',
	'among', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'because', 'been',
	'but', 'by', 'can', 'cannot', 'could', 'dear', 'did', 'do', 'does', 'either',
	'else', 'ever', 'every', 'for', 'from', 'get', 'got', 'had', 'has', 'have',
	'he', 'her', 'hers', 'him', 'his', 'how', 'however', 'i', 'if', 'in', 'into',
	'is', 'it', 'its', 'just', 'least', 'let', 'like', 'likely', 'may', 'me',
	'might', 'most', 'must', 'my', 'neither', 'no', 'nor', 'not', 'of', 'off',
	'often', 'on', 'only', 'or', 'other', 'our', 'own', 'rather', 'said', 'say',
	'says', 'she', 'should', 'since', 'so', 'some', 'than', 'that', 'the',
	'their', 'them', 'then', 'there', 'these', 'they', 'this', 'tis', 'to',
	'too', 'twas', 'us', 'wants', 'was', 'we', 'were', 'what', 'when', 'where',
	'which', 'while', 'who', 'whom', 'why', 'will', 'with', 'would', 'yet',
	'you', 'your', 'ain\'t', 'aren\'t', 'can\'t', 'could\'ve', 'couldn\'t',
	'didn\'t', 'doesn\'t', 'don\'t', 'hasn\'t', 'he\'d', 'he\'ll', 'he\'s',
	'how\'d', 'how\'ll', 'how\'s', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'isn\'t',
	'it\'s', 'might\'ve', 'mightn\'t', 'must\'ve', 'mustn\'t', 'shan\'t',
	'she\'d', 'she\'ll', 'she\'s', 'should\'ve', 'shouldn\'t', 'that\'ll',
	'that\'s', 'there\'s', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve',
	'wasn\'t', 'we\'d', 'we\'ll', 'we\'re', 'weren\'t', 'what\'d', 'what\'s',
	'when\'d', 'when\'ll', 'when\'s', 'where\'d', 'where\'ll', 'where\'s',
	'who\'d', 'who\'ll', 'who\'s', 'why\'d', 'why\'ll', 'why\'s', 'won\'t',
	'would\'ve', 'wouldn\'t', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve' ];

export
const UserRoles = {
	Admin: 'admin',
	User: 'user',
} as const;
