import { Paths } from '@common/constants';
import { getServerSession } from '@server/auth-options';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import { LogoSmallImage } from '@common/images';
import Link from 'next/link';
import CommonStuff from '@app/(content)/common-stuff';

interface Props {
	children: ReactNode;
}

export default
async function Layout(props: Props) {
	const session = await getServerSession();

	if(session) {
		redirect(Paths.Home);
	}

	return (
		<>
			<div className="shadow top-0 left-0 w-full z-10">
				<div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between h-16 border-b">
					{/** set toolbar https://tailwindui.com/components/application-ui/navigation/navbars */}
					<div className="w-full h-full flex">
						<Link href="/">
							<div className="flex gap-2 h-full">
								<Image
									alt=""
									src={LogoSmallImage}
									className="w-full h-full flex"
								/>
								<div className="text-xl font-bold ">
									ProjectGallery.me
								</div>
							</div>
						</Link>
					</div>
				</div>
			</div>
			<div className="mt-5 text-center">
				<div className="inline-block text-left">
					{props.children}
				</div>
			</div>
			<CommonStuff />
		</>
	);
}
