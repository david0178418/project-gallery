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
			<div className="text-center">
				<div className="font-bold text-5xl">
					<div className="text-primary">
						Your Project<br />
					</div>
					Your Story
				</div>
				<div className="w-90 inline-block mt-8">
					<ul className="text-left">
						{[
							<>
								<strong>Create</strong> a personal project portfolio
							</>,
							<>
								<strong>Focus</strong> on your work, not presentation
							</>,
							<>
								<strong>Document</strong> your progress with a journal
							</>,
							<>
								<strong>Share</strong> your experience with the world
							</>,
							<>
								<strong>Discover</strong> the work of other builders
							</>,
						].map((t, i) => (
							<li key={i}>
								<div className="pr-1 my-5 justify-end">
									<PositiveBulletIcon className="h-6 w-6 text-primary inline mr-2" />
									{t}
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>
			<div className="text-center max-w-md mt-3 mx-auto">
				<div className="mb-5">
					<Link href={Paths.UserRegister}>
						<Button className="rounded-full w-full box-content p-2 text-xl font-normal">
							Create Your{SpecialCharacterCodes.NBSP}<span className="font-bold">Free</span>{SpecialCharacterCodes.NBSP}Gallery
						</Button>
					</Link>
				</div>
				<div className="">
					<Link href={Paths.Home}>
						<Button variant="outline" className="rounded-full w-full box-content p-2 text-xl font-normal">
							Explore Project Gallery
						</Button>
					</Link>
				</div>
			</div>
			<div className="text-center mt-6">
				<Image
					alt=""
					priority
					src={MainImage}
					className="object-contain inline w-full max-h-full max-w-4xl mr-20 "
					style={{
						position: 'revert',
						height: 'revert',
					}}
				/>
			</div>
		</div>
	);
}
