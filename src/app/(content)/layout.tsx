import { ReactNode } from 'react';
import LeftRail from './page-frame/left-rail';
// import { BottomNav } from './page-frame/bottom-nav';
import TopNav from './page-frame/top-nav';
// import { cn } from '@/lib/utils';

interface Props {
	children?: ReactNode;
}

export default
// https://flowbite.com/blocks/application/shells/
function ContentLayout(props: Props) {
	const { children } = props;

	return (
		<div className="antialiased bg-gray-50 dark:bg-gray-900">
			<TopNav/>
			<LeftRail />
			<main className="p-4 md:ml-64 h-auto pt-20">
				{children}
			</main>
			{/* <BottomNav/> */}
		</div>
	);
}
