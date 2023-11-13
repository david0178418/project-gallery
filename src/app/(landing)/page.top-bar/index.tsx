import { LogoSmallImage } from '@common/images';
import Image from 'next/image';
import Link from 'next/link';
import { Paths } from '@common/constants';
import TopBarDrawer from './page.top-bar.drawer';
import { getServerSession } from '@server/auth-options';
import LogoutButton from '@components/logout-button';
import { Button } from '@components/ui/button';

export default
async function TopBar() {
	const session = await getServerSession();
	const user = session?.user || null;
	return (
		<div
			className="fixed shadow"
			// sx={{
			// 	backdropFilter: 'blur(8px)',
			// 	backgroundColor: 'rgba(255,255,255,0.8)',
			// 	boxShadow: 'inset 0px -1px 1px #ddd',
			// }}
		>
			<div className="container">
				{/** set toolbar https://tailwindui.com/components/application-ui/navigation/navbars */}
				<div className="border-b">
					<div className="w-full flex">
						<Link href="/">
							<div className="flex gap-1">
								<Image
									height={100}
									width={100}
									alt=""
									src={LogoSmallImage}
								/>
								<div className="text-xl font-bold hidden sm:inline">
									ProjectGallery.me
								</div>
							</div>
						</Link>
					</div>
					<div className="hidden sm:flex">
						<Link href="https://projectgallery.me/project/63a490bfacb4e70acc9931bb/journals">
							<Button className="mr-1">
								Blog
							</Button>
						</Link>
						{!user && (
							<>
								<Link href={Paths.UserLoginEmail}>
									<Button variant="ghost" className="mr-1">
										Login
									</Button>
								</Link>
								<Link href={Paths.UserRegister}>
									<Button>
										Register
									</Button>
								</Link>
							</>
						)}
						{user && (
							<>
								<div className="mr-1">
									<LogoutButton />
								</div>
								<Link href={Paths.Home}>
									<Button>
										{user.username}
									</Button>
								</Link>
							</>
						)}
					</div>
					<div className="block sm:hidden">
						<TopBarDrawer user={user}/>
					</div>
				</div>
			</div>
		</div>
	);
}
