import Box from '@mui/material/Box';
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
			<Box
				component="a"
				sx={{ width: '100%' }}
			>
				<Box
					sx={{
						display: {
							xs: 'none',
							md: 'block',
						},
					}}
				>
					<Image
						alt=""
						style={{
							maxWidth: '100%',
							height: 'auto',
						}}
						src={inverted ? LogoInvertedImage : LogoImage} />
				</Box>
				<Box
					sx={{
						display: {
							xs: 'block',
							md: 'none',
						},
						paddingLeft: 1.5,
					}}
				>
					<Image
						alt=""
						src={inverted ? LogoSmallInvertedImage : LogoSmallInvertedImage}
					/>
				</Box>
			</Box>
		</Link>
	);
}
