'use client';
import { ProfileLinkButton } from '@components/profile-button';
import { useRouter } from 'next/navigation';
import { useEffectOnce } from '@common/hooks';
import CollpaseAreaToggle from '@components/collapse-area-toggle';
import { useState } from 'react';

interface Props {
	rootUrl: string;
	pageName: string;
	foos: Foo[];
}

interface Foo {
	key: string;
	label: string;
	url: string;
	icon: any;
	items: Array<{
		_id: string;
		title: string;
		url: string;
	}>;
}

// TODO: All this should be unnecessary since this should be handled in layout
// once this issue is resolved:
// https://github.com/vercel/next.js/issues/49279

export default
function AnimatedBody(props: Props) {
	const {
		rootUrl,
		pageName,
		foos,
	} = props;
	const [nextPage, setNextPage] = useState<string | null>(null);
	const [initialRender, setInitialRender] = useState(true);
	const { push } = useRouter();
	const transitionToNextPage = nextPage !== null;
	const activeFoo = foos.find((f) => f.key === pageName);

	useEffectOnce(() => {
		setInitialRender(false);
	});

	if(!activeFoo) {
		return null;
	}

	return (
		<>
			{foos.map((f) => (
				<CollpaseAreaToggle
					key={f.key}
					label={f.label}
					show={!initialRender && pageName === f.key && !transitionToNextPage}
					active={pageName === f.key}
					icon={f.icon}
					onTransitionEnd={handleTransitionEnd}
					onButtonClick={() => handlePageClick(f.key)}
				>
					{f.items.map((i) => (
						<ProfileLinkButton
							key={i._id}
							icon={f.icon}
							href={i.url}
						>
							{i.title}
						</ProfileLinkButton>
					))}
				</CollpaseAreaToggle>
			))}
		</>
	);

	function handleTransitionEnd() {
		if(!transitionToNextPage) {
			return;
		}

		const nextFooUrl = foos.find((f) => f.key === nextPage)?.url || rootUrl;
		push(nextFooUrl);
	}

	function handlePageClick(clickedPage: string) {
		const keyOfShowingFoo = clickedPage === pageName ?
			'' :
			foos.find((f) => f.key === clickedPage)?.key || '';
		setNextPage(keyOfShowingFoo);
	}
}
