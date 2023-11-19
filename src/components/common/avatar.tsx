
import { ReactNode } from 'react';
import {
	Avatar as ShadCnAvatar,
	AvatarFallback,
	AvatarImage,
} from '@/components/ui/avatar';

interface Props {
	src?: string;
	fallback?: ReactNode;
	className?: string;
}

export default function Avatar(props: Props) {
	const {
		src,
		fallback,
		className = '',
	} = props;

	return (
		<ShadCnAvatar className={className}>
			<AvatarImage className="object-cover" src={src} />
			{fallback && (
				<AvatarFallback>
					{fallback}
				</AvatarFallback>
			)}
		</ShadCnAvatar>
	);
}
