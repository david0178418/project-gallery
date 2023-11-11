import Image from 'next/image';
import { ReactNode } from 'react';
import Img1 from './img1.png';
import Img2 from './img2.png';
import Img3 from './img3.png';
import Link from 'next/link';
import { Paths, SpecialCharacterCodes } from '@common/constants';
import { cn } from '@/lib/utils';
import { Button } from '@components/ui/button';

const { NBSP: S } = SpecialCharacterCodes;

export default
function Features() {
	return (
		<>
			<div className="grid mt-10 flex-col-reverse md:flex-col bg-[#5271ff11]">
				<div className="col-span-12 md:col-span-7 p-3 text-center md:text-right">
					<ImageWrapper>
						<Image
							height={100}
							width={100}
							alt=""
							src={Img1}
							style={{
								position: 'revert',
								objectFit: 'contain',
								height: 'revert',
								width: '100%',
								maxHeight: '100%',
								maxWidth: 600,
							}}
						/>
					</ImageWrapper>
				</div>
				<div className="col-span-12 md:col-span-4 p-5 pb-0 md:pb-5 text-center md:text-left">
					<div className="font-bold mb-2">
						Let Your Work Speak for Itself
					</div>
					<p>
						No more struggling with how to present your projects - simply enter your work and let it do the talking.
						Our platform puts the spotlight on your talent and creativity, allowing you to showcase your skills with ease.
					</p>
				</div>
			</div>

			<div className="mt-5">
				<div className={cn(
					'col-start-2',
					'col-span-12',
					'md:col-span-4',
					'p-5',
					'pt-0',
					'md:pt-5',
					'text-center',
					'md:text-right',
				)}>
					<div className="font-bold mb-2">
						Document Your Journey
					</div>
					<p>
						What challeges did you have to overcome?
						How did you balance the choices you had when you made your decisions?
						Capture and share these unique expriences in a project journal.
					</p>
				</div>
				<div className={cn(
					'col-span-12',
					'md:col-span-5',
					'p-3',
					'pt-0',
					'md:pt-5'
				)}>
					<ImageWrapper>
						<Image
							height={100}
							width={100}
							alt=""
							src={Img2}
							style={{
								position: 'revert',
								objectFit: 'contain',
								height: 'revert',
								width: '100%',
								maxHeight: '100%',
								maxWidth: 600,
							}}
						/>
					</ImageWrapper>
				</div>
			</div>

			<div className={cn(
				'mt-5',
				'flex-row-reverse',
				'md:flex-row',
				'bg-[#5271ff11]'
			)}>
				<div className={cn(
					'col-span-12',
					'col-span-7',
					'p-3',
					'text-center',
					'md:text-right'
				)}>
					<ImageWrapper>
						<Image
							height={100}
							width={100}
							alt=""
							src={Img3}
							style={{
								position: 'revert',
								objectFit: 'contain',
								height: 'revert',
								width: '100%',
								maxHeight: '100%',
								maxWidth: 600,
							}}
						/>
					</ImageWrapper>
				</div>
				<div className={cn(
					'col-span-12',
					'md:col-span-4',
					'p-4',
					'pb-0',
					'md:pb-5',
					'text-center',
					'md:text-left',
				)}>
					<div className="font-bold mb-2">
						Links and Categories
					</div>
					<p>
						Add at-a-glance context to your project with custom category labels.
						Take it a step further by linking off-site for the project itself or any other information that others would find interesting.
					</p>
				</div>
			</div>

			<div className="flex mb-32 text-center mt-10 md:mt-15">
				<Link href={Paths.UserRegister}>
					<Button className="rounded-md text-lg w-1">
						Create Your{S}<strong>Free</strong>{S}Gallery
					</Button>
				</Link>
			</div>
		</>
	);
}

interface ImageWrapperProps {
	children: ReactNode;
}

function ImageWrapper(props: ImageWrapperProps) {
	const { children } = props;
	return (
		<div className="p-2 inline-block shadow-lg">
			{children}
		</div>
	);
}
