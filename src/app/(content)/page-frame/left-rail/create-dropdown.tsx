'use client';

import Link from 'next/link';
import { Paths } from '@common/constants';
import Fab from '@/components/common/fab';
import {
	AddIcon,
	ProjectIcon,
	EditIcon,
} from '@/components/icons';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

export
function CreateDropdown() {
	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Fab
						className="bg-blue-500 inline-flex md:hidden"
					>
						<AddIcon/>
					</Fab>
					<Fab
						className="bg-blue-500 w-full hidden md:inline-flex"
					>
						<AddIcon sx={{ mr: 1 }} />
						Create
					</Fab>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>
						<Link
							shallow
							href={Paths.ProjectEdit()}
						>
							<ProjectIcon className="mr-2 h-4 w-4" />
							<span>Project</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Link
							shallow
							href={Paths.JournalEdit()}
						>
							<EditIcon className="mr-2 h-4 w-4" />
							<span>Journal Post</span>
						</Link>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
