import { LogoSmallImage } from '@common/images';
import Image from 'next/image';
import Link from 'next/link';
import { Paths } from '@common/constants';
import TopBarDrawer from './page.top-bar.drawer';
import { getServerSession } from '@server/auth-options';
import LogoutButton from '@components/logout-button';
import { Button } from '@components/ui/button';

const BlogId = '63a490bfacb4e70acc9931bb';

export default
async function TopBar() {
	const session = await getServerSession();
	const user = session?.user || null;
	return (
		<div className="fixed shadow top-0 left-0 w-full bg-white bg-opacity-90 z-10">
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
							<div className="text-xl font-bold hidden sm:inline">
								ProjectGallery.me
							</div>
						</div>
					</Link>
				</div>
				<div className="hidden sm:flex">
					<Link href={Paths.ProjectJournals(BlogId)}>
						<Button className="mr-1" size="sm" variant="ghost">
								Blog
						</Button>
					</Link>
					{!user && (
						<>
							<Link href={Paths.UserLoginEmail}>
								<Button variant="outline" size="sm" className="mr-1" >
									Login
								</Button>
							</Link>
							<Link href={Paths.UserRegister}>
								<Button size="sm">
									Register
								</Button>
							</Link>
						</>
					)}
					{user && (
						<>
							<div className="mr-1">
								<LogoutButton size="sm" />
							</div>
							<Link href={Paths.Home}>
								<Button size="sm">
									{user.username}
								</Button>
							</Link>
						</>
					)}
				</div>
				<div className="ml-10 flex items-baseline space-x-4 sm:hidden">
					<TopBarDrawer user={user}/>
				</div>
			</div>
		</div>
	);
}
