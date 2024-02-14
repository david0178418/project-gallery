'use client';
import { ProfileLinkButton } from '@components/profile-button';
import { useRouter } from 'next/navigation';
import { useEffectOnce } from '@common/hooks';
import CollpaseAreaToggle from '@components/collapse-area-toggle';
import { useState } from 'react';

interface Props {
	rootUrl: string;
	collections: AnimatedBodyCollection[];
}

export
interface AnimatedBodyCollection {
	active?: boolean;
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
		collections,
	} = props;
	const [nextPage, setNextPage] = useState<string | null>(null);
	const [initialRender, setInitialRender] = useState(true);
	const { push } = useRouter();
	const transitionToNextPage = nextPage !== null;
	const activeCollection = collections.find(c => c.active);

	useEffectOnce(() => {
		setInitialRender(false);
	});

	if(!activeCollection) {
		return null;
	}

	return (
		<>
			{collections.map(c => (
				<CollpaseAreaToggle
					key={c.key}
					label={c.label}
					show={!initialRender && c.active && !transitionToNextPage}
					active={c.active}
					icon={c.icon}
					onTransitionEnd={handleTransitionEnd}
					onButtonClick={() => handlePageClick(c.key)}
				>
					{c.items.map((i) => (
						<ProfileLinkButton
							key={i._id}
							icon={c.icon}
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

		const nextCollectionUrl = collections.find(c => c.key === nextPage)?.url || rootUrl;
		push(nextCollectionUrl);
	}

	function handlePageClick(clickedPage: string) {
		const keyOfOpenCollection = clickedPage === activeCollection?.key ?
			'' :
			collections.find(c => c.key === clickedPage)?.key || '';
		setNextPage(keyOfOpenCollection);
	}
}
