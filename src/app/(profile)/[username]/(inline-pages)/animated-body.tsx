'use client';
import { ProfileButton, ProfileLinkButton } from '@components/profile-button';
import ProfileShareButton from '@components/profile-share-button';
import { Paths } from '@common/constants';
import { ReactNode, useState } from 'react';
import { CustomLink } from '@common/types/CustomLink';
import { Collapse } from '@mui/material';
import { UiProject } from '@common/types/Project';
import { useRouter } from 'next/navigation';
import {
	CloseIcon,
	JournalIcon,
	ProfileIcon,
	ProjectIcon,
} from '@components/icons';
import { useEffectOnce } from '@common/hooks';
import { UiJournal } from '@common/types/Journal';
import MarkdownContent from '@components/markdown-content';

type Page = 'projects' | 'about' | 'journals';

interface Props {
	pageName: Page;
	username: string;
	links: CustomLink[];
	projects: UiProject[];
	journals: UiJournal[];
	about: string;
}

const NextPage = {
	['']: Paths.UserGallery,
	projects: Paths.UserGalleryProjects,
	journals: Paths.UserGalleryJournals,
	about: Paths.UserGalleryAbout,
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
		about,
	} = props;
	const [nextPage, setNextPage] = useState<Page | '' | null>(null);
	const [initialRender, setInitialRender] = useState(true);
	const { push } = useRouter();
	const showing = {
		projects: pageName === 'projects',
		about: pageName === 'about',
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
		// setNextPage(null);
	}

	function handlePageClick(clickedPage: Page) {
		setNextPage(showing[clickedPage] ? '' : clickedPage);
	}

	return (
		<>
			<Foo
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
			</Foo>
			<Foo
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
			</Foo>
			<Foo
				label="About"
				show={!initialRender && showing.about && !transitionToNextPage}
				active={showing.about}
				icon={ProfileIcon}
				onTransitionEnd={handleTransitionEnd}
				onButtonClick={() => handlePageClick('about')}
			>
				<MarkdownContent>
					{about}
				</MarkdownContent>
			</Foo>
			{links.map((l, i) => (
				<ProfileLinkButton
					key={i}
					href={l.url}
					target="_blank"
				>
					{l.label}
				</ProfileLinkButton>
			))}
			<ProfileShareButton shareObj={{
				url: Paths.UserGallery(username),
				label: `${username}'s Project Gallery`,
				shareMsg: `Check out ${username}'s Project Gallery`,
			}}/>
		</>
	);
}

interface FooProps {
	icon: any;
	active: boolean;
	show: boolean;
	children: ReactNode;
	onButtonClick(): void;
	onTransitionEnd(): void;
	label: string;
}

function Foo(props: FooProps) {
	const {
		label,
		onButtonClick,
		show,
		icon: Icon,
		active,
		onTransitionEnd,
		children,
	} = props;
	return (
		<>
			<ProfileButton
				onClick={onButtonClick}
				icon={
					active ?
						CloseIcon :
						Icon
				}
			>
				{label}
			</ProfileButton>
			<Collapse
				in={show}
				onTransitionEnd={onTransitionEnd}
				sx={{
					marginLeft: {
						xs: 2,
						md: 10,
					},
				}}
			>
				{children}
			</Collapse>
		</>
	);
}
