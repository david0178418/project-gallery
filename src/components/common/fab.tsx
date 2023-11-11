/**
 * v0 by Vercel.
 * @see https://v0.dev/t/Hx9UWweBNp7
 */

import { type ComponentProps } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Fab(props: ComponentProps<typeof Button>) {
	const {
		className,
		children,
	} = props;

	return (
		<Button className={cn(
			'fixed',
			'bottom-4',
			'right-4',
			'h-12',
			'w-12',
			'rounded-full',
			'bg-blue-500',
			'shadow-lg',
			'text-white',
			'text-center',
			'text-2xl',
			className,
		)}>
			{children}
		</Button>
	);
}
