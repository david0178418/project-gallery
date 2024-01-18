'use client';
import { ProfileButton, ProfileLinkButton } from '@components/profile-button';
import ProfileShareButton from '@components/profile-share-button';
import { Paths } from '@common/constants';
import { CustomProfileItem } from '@common/types/CustomLink';
import { UiProject } from '@common/types/Project';
import { useRouter } from 'next/navigation';
import { useEffectOnce } from '@common/hooks';
import { UiJournal } from '@common/types/Journal';
import CollpaseAreaToggle from '@components/collapse-area-toggle';
import {
	Fragment,
	useState,
} from 'react';
import {
	JournalIcon,
	ProjectIcon,
} from '@components/icons';

type Page = 'projects' | 'journals';

interface Props {
	pageName: Page;
	username: string;
	links: CustomProfileItem[];
	projects: UiProject[];
	journals: UiJournal[];
}

const NextPage = {
	['']: Paths.UserGallery,
	projects: Paths.UserGalleryProjects,
	journals: Paths.UserGalleryJournals,
} as const;

// TODO: All this should be unnecessary since this should be handled in layout
// once this issue is resolved:
// https://github.com/vercel/next.js/issues/49279

export default
function AnimatedBody(props: Props) {
	const {
		username,
		links,
		projects,
		journals,
		pageName,
	} = props;
	const [nextPage, setNextPage] = useState<Page | '' | null>(null);
	const [initialRender, setInitialRender] = useState(true);
	const { push } = useRouter();
	const showing = {
		projects: pageName === 'projects',
		journals: pageName === 'journals',
	} as const;
	const transitionToNextPage = nextPage !== null;

	useEffectOnce(() => {
		setInitialRender(false);
	});

	function handleTransitionEnd() {
		if(!transitionToNextPage) {
			return;
		}

		push(NextPage[nextPage](username));
	}

	function handlePageClick(clickedPage: Page) {
		setNextPage(showing[clickedPage] ? '' : clickedPage);
	}

	return (
		<>
			<CollpaseAreaToggle
				label="Projects"
				show={!initialRender && showing.projects && !transitionToNextPage}
				active={showing.projects}
				icon={ProjectIcon}
				onTransitionEnd={handleTransitionEnd}
				onButtonClick={() => handlePageClick('projects')}
			>
				{projects.map((p) => (
					<ProfileLinkButton
						key={p._id.toString()}
						icon={ProjectIcon}
						href={Paths.Project(p._id.toString())}
					>
						{p.title}
					</ProfileLinkButton>
				))}
			</CollpaseAreaToggle>
			<CollpaseAreaToggle
				label="Posts"
				show={!initialRender && showing.journals && !transitionToNextPage}
				active={showing.journals}
				icon={JournalIcon}
				onTransitionEnd={handleTransitionEnd}
				onButtonClick={() => handlePageClick('journals')}
			>
				{journals.map((p) => (
					<ProfileLinkButton
						key={p._id.toString()}
						icon={JournalIcon}
						href={Paths.Journal(p._id.toString())}
					>
						{p.title}
					</ProfileLinkButton>
				))}
			</CollpaseAreaToggle>
			{links.map((l, i) => (
				<Fragment key={i}>
					{l.type === 'link' && (
						<ProfileLinkButton
							href={l.value}
							target="_blank"
						>
							{l.label}
						</ProfileLinkButton>
					)}
					{l.type === 'text' && (
						<ProfileButton
							onClick={() => console.log(111)}
						>
							{l.label}
						</ProfileButton>
					)}
				</Fragment>
			))}
			<ProfileShareButton shareObj={{
				url: Paths.UserGallery(username),
				label: `${username}'s Project Gallery`,
				shareMsg: `Check out ${username}'s Project Gallery`,
			}}/>
		</>
	);
}
