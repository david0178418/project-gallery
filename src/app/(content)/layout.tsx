import { ReactNode } from 'react';
import { LeftRail } from './page-frame/left-rail';
import { BottomNav } from './page-frame/bottom-nav';
import CommonStuff from './common-stuff';
import { cn } from '@/lib/utils';

interface Props {
	children?: ReactNode;
}

export default
function ContentLayout(props: Props) {
	const { children } = props;

	return (
		<div
			className={cn(
				'container',
				'flex',
				'h-screen',
				'overflow-hidden',
				'xs:px-0',
				'sm:px-1',
				'lg:px-2',
			)}
		>
			<div
				className={cn(
					'container',
					'grid-cols-16',
					'my-0',
					'gap-0',
				)}
			>
				<div
					className={cn(
						'col-span-2',
						'sm:col-span-4',
						'sm:hidden',
						'md:block',
					)}
				>
					<div>
						{/** Wrapped in a random div due to this issue:
							 * https://stackoverflow.com/questions/56347839/material-ui-v4-0-1-warning-expected-an-element-that-can-hold-a-ref
							 */}
						<LeftRail />
					</div>
				</div>
				<div
					className={cn(
						'col-span-16',
						'sm:col-span-14',
						'md:col-span-12',
						'overflow-y-auto',
						'h-full',
						'overflow-hidden',
						'relative',
					)}
				>
					{children}
				</div>
			</div>
			{/** div hack for async component child */}
			<div>
				<BottomNav/>
			</div>
			<CommonStuff/>
		</div>
	);
}
