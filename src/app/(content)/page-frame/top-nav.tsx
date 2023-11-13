import Logo from './logo';
import { cn } from '@/lib/utils';

export default
async function TopNav() {
	return (
		<nav className="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50">
			<div className="flex flex-wrap justify-between items-center">
				<div className="flex justify-start items-center">
					<Logo/>
				</div>
				<div className="flex items-center lg:order-2">
					<button
						type="button"
						className={cn(
							'flex',
							'mx-3',
							'text-sm',
							'bg-gray-800',
							'rounded-full',
							'md:mr-0',
							'focus:ring-4',
							'focus:ring-gray-300',
							'dark:focus:ring-gray-600',
						)}
					>
						<img
							className="w-8 h-8 rounded-full"
							src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gough.png"
						/>
					</button>
				</div>
			</div>
		</nav>

	);
}
