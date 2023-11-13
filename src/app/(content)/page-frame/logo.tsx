import Image from 'next/image';
import Link from 'next/link';
import { Paths } from '@common/constants';
import {
	LogoImage,
	LogoInvertedImage,
	LogoSmallImage,
	LogoSmallInvertedImage,
} from '@common/images';

interface Props {
	inverted?: boolean;
}

export default
function Logo(props: Props) {
	const { inverted } = props;

	return (
		<Link className="w-full" href={Paths.Home} >
			<div className="hidden md:block">
				<Image
					alt=""
					style={{
						maxWidth: '100%',
						height: 'auto',
					}}
					src={inverted ? LogoInvertedImage : LogoImage} />
			</div>
			<div className="block md:hidden pl-2">
				<Image
					alt=""
					src={inverted ? LogoSmallInvertedImage : LogoSmallImage}
				/>
			</div>
		</Link>
	);
}
