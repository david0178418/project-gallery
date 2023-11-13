import Image from 'next/image';
import MainImage from './homepage-main-image.png';
import { PositiveBulletIcon } from '@components/icons';
import Link from 'next/link';
import { Paths, SpecialCharacterCodes } from '@common/constants';
import { Button } from '@components/ui/button';

export default
function Hero() {
	return (
		<div className="container">
			<div className="text-center mt-15">
				<div className="font-bold text-4xl">
					<div>
						Your Project<br />
					</div>
					Your Story
				</div>
				<div className="grid grid-cols-12 flex-row justify-center mt-4">
					<div className="col-span-12 sm:col-span-6 lg:col-span-4">
						<ul>
							{[
								<>
									<strong>Create</strong> your own personal project portfolio
								</>,
								<>
									<strong>Focus</strong> on your work, not how to present it
								</>,
								<>
									<strong>Document</strong> your progress  with a project journal
								</>,
								<>
									<strong>Share</strong> your experience with the world
								</>,
								<>
									<strong>Discover</strong> the work of other builders
								</>,
							].map((t, i) => (
								<li key={i}>
									<div className="min-w-md-[56px] pr-1 justify-end">
										<PositiveBulletIcon color="primary" />
										{t}
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
			<div className="text-center mt-4 flex flex-col gap-3">
				<Link href={Paths.UserRegister}>
					<Button className="rounded-lg w-1 sm:w-auto">
						Create Your{SpecialCharacterCodes.NBSP}<strong>Free</strong>{SpecialCharacterCodes.NBSP}Gallery
					</Button>
				</Link>
				<Link href={Paths.Home}>
					<Button className="rounded-lg w-1 sm:w-auto">
						Explore Project Gallery
					</Button>
				</Link>
			</div>
			<div className="text-center mt-6 sm:mr-10">
				<Image
					height={100}
					width={100}
					alt=""
					priority
					src={MainImage}
					style={{
						position: 'revert',
						objectFit: 'contain',
						height: 'revert',
						width: '100%',
						maxHeight: '100%',
						maxWidth: 900,
					}}
				/>
			</div>
		</div>
	);
}
