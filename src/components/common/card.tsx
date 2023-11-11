import { ReactNode } from 'react';
import {
	Card as ShadCNCard,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

interface Props {
	title?: ReactNode
	description?: ReactNode
	children: ReactNode;
	footer?: ReactNode;
}

export default
function Card(props: Props) {
	const {
		title,
		description,
		children,
		footer,
	} = props;

	return (
		<ShadCNCard>
			{(title || description) && (
				<CardHeader>
					{title && (
						<CardTitle>
							{title}
						</CardTitle>
					)}
					{description && (
						<CardDescription>
							{description}
						</CardDescription>
					)}
				</CardHeader>
			)}
			<CardContent>
				{children}
			</CardContent>
			{footer && (
				<CardFooter>
					{footer}
				</CardFooter>
			)}
		</ShadCNCard>
	);
}
