import { Paths } from '@common/constants';
import { fetchProject, fetchUserProfileByUsername } from '@server/queries';
import { MongoIdValidation } from '@server/validations';
import { ScrollContent } from '@components/scroll-content';
import { EditIcon } from '@components/icons';
import { ReactNode } from 'react';
import ProjectTabs from './project-tabs';
import { getServerSession } from '@server/auth-options';
import BackButton from '@components/back-button';
import Link from 'next/link';
import Fab from '@components/common/fab';
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@components/ui/avatar';

interface Props {
	children: ReactNode;
	params: {
		projectId: string;
		tab?: string[];
	};
}

export default
async function Page(props: Props) {
	const {
		children,
		params: { projectId },
	} = props;

	const result = await MongoIdValidation.safeParseAsync(projectId);

	const project = result.success ?
		await fetchProject(projectId) :
		null;

	if(!project) {
		return (
			<div>
				Invalid Project
			</div>
		);
	}

	const session = await getServerSession();
	const isOwner = project.owner._id.toString() === session?.user.id;
	const profile = await fetchUserProfileByUsername(project.owner.username);

	return (
		<>
			<ScrollContent
				header={
					<div className="pt-1 pb-2 px-1">
						<div className="grid">
							<div className="col-span-6">
								<div>
									{/** TODO Capture direct links and send them to home page */}
									<BackButton />
								</div>
							</div>
							<div className="col-span-6 text-right">
								<div className="text-sm inline-block">
									<Link
										href={Paths.UserGallery(project.owner.username)}
										style={{ textDecoration: 'none' }}
									>
										<Avatar className="bg-red-500">
											<AvatarImage src={profile?.avatar}/>
											<AvatarFallback>
												{project.owner.username[0].toLocaleUpperCase()}
											</AvatarFallback>
										</Avatar>
									</Link>
									<Link href={Paths.UserGallery(project.owner.username)}>
											By {project.owner.username}
									</Link>
								</div>
							</div>
						</div>
						<div className="flex flex-col items-center justify-center">
							<div className="font-bold">
								{project.title}
							</div>
						</div>
						<div className="pt-2 border-b border-current">
							<ProjectTabs projectId={project._id.toString()} />
						</div>
					</div>
				}
			>
				{children}
			</ScrollContent>
			{isOwner && (
				<Link href={Paths.ProjectEdit(projectId)} >
					<Fab
						// sx={{
						// 	position: 'absolute',
						// 	bottom: 64,
						// 	right: 16,
						// }}
					>
						<EditIcon />
					</Fab>
				</Link>
			)}
		</>
	);
}
