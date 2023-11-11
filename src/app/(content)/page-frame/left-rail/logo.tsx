import Image from 'next/image';
import Link from 'next/link';
import { Paths } from '@common/constants';
import {
	LogoImage,
	LogoInvertedImage,
	LogoSmallInvertedImage,
} from '@common/images';

interface Props {
	inverted?: boolean;
}

export default
function Logo(props: Props) {
	const { inverted } = props;

	return (
		<Link passHref href={Paths.Home} legacyBehavior>
			<a className="w-full">
				<div className="hidden md:block">
					<Image
						height={100}
						width={100}
						alt=""
						style={{
							maxWidth: '100%',
							height: 'auto',
						}}
						src={inverted ? LogoInvertedImage : LogoImage} />
				</div>
				<div className="block md:hidden pl-2">
					<Image
						height={100}
						width={100}
						alt=""
						src={inverted ? LogoSmallInvertedImage : LogoSmallInvertedImage}
					/>
				</div>
			</a>
		</Link>
	);
}
