import { ReactNode } from 'react';
import {
	Tooltip as ShadCnTooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

interface Props {
	label: string
	children: ReactNode;
}

export default function Tooltip(props: Props) {
	const {
		label,
		children,
	} = props;
	return (
		<TooltipProvider>
			<ShadCnTooltip>
				<TooltipTrigger asChild>
					{children}
				</TooltipTrigger>
				<TooltipContent>
					<p>{label}</p>
				</TooltipContent>
			</ShadCnTooltip>
		</TooltipProvider>
	);
}
