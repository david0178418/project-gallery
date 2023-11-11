import { UsernameValidation } from '@common/types/UserCredentials';
import { fetchUser, fetchUserGallery } from '@server/queries';
import ProjectCard from '@components/project-card';
import { getServerSession } from '@server/auth-options';
import OrderControlBlock from './order-control';
import { uniqueBy } from '@common/utils';
import Link from 'next/link';
import Label from '@components/label';
import { Paths } from '@common/constants';
import classes from './projects.module.css';

interface Props {
	params: {
		username: string;
	};
	searchParams: {
		labels?: string | string[]
	};
}

export default
async function UserProjectsPage(props: Props) {
	const {
		params: { username: routeUsername },
		searchParams: { labels: routeLabels = [] },
	} = props;
	const result = await UsernameValidation.safeParseAsync(routeUsername);

	const pageUser = result.success ?
		await fetchUser(result.data) :
		null;
	const username = pageUser?.username;

	if(!username) {
		return (
			<>
				User not found.
			</>
		);
	}

	const session = await getServerSession();
	const selectedLabels = [routeLabels].flat();
	const projects = await fetchUserGallery(username);
	const uniqueLabels = uniqueBy(projects.flatMap(p => p.labels), 'label');

	// TODO CLean this mess up
	const filteredProjects = projects.filter(
		p => !selectedLabels.length ||
			p.labels.some(l => selectedLabels.includes(l.label))
	);
	const isOwner = !!username && (username === session?.user.username);
	const profilePath = Paths.UserGallery(username);

	return (
		<>
			{!!projects.length && (
				<>
					{!!uniqueLabels.length && (
						<div className="pb-2 border-b-2">
							<div className="opacity-60 font-bold">
								Filter labels
							</div>
							{uniqueLabels.map(l => (
								<LinkLabel
									key={l.label}
									label={l.label}
									path={profilePath}
									selected={selectedLabels.includes(l.label)}
									selectedLabels={selectedLabels}
								/>
							))}

						</div>
					)}
					<div className="grid grid-cols-12 p-1 gap-2">
						{filteredProjects.map((p, i) => (
							<div
								key={p._id.toString()}
								className="group col-span-12 sm:col-span-6 md:col-span-4 relative"
								// sx={{
								// 	'& .change-order-action': {
								// 		xs: { display: 'flex' },
								// 		// sm: { display: 'none' },
								// 	},
								// 	'&:hover .change-order-action': { display: 'flex' },
								// }}
							>
								<div className={`${classes.fadeInEl}`} style={{ animationDelay: `${i * 100}ms` }}>
									{/** div hack for async component child */}
									<div>
										<ProjectCard project={p} />
										{isOwner && projects && !selectedLabels.length && (
											<div className="absolute w-full bottom-72 flex sm:hidden group-hover:flex">
												<OrderControlBlock
													first={i === 0}
													last={i === projects.length - 1}
													projectId={p._id.toString()}
												/>
											</div>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</>
			)}
			{!projects.length && (
				<div>
					No projects yet
				</div>
			)}
		</>
	);
}

interface LinkLabelProps {
	selected: boolean;
	label: string;
	path: string;
	selectedLabels: string[];
}

function LinkLabel(props: LinkLabelProps) {
	const {
		selected,
		label,
		path,
		selectedLabels,
	} = props;

	return (
		<Link
			key={label}
			href={{
				pathname: path,
				query: {
					labels: selected ?
						selectedLabels.filter(l => l !== label) :
						[ ...selectedLabels, label ],
				},
			}}
		>
			<Label
				label={label}
				// color={
				// 	selected ?
				// 		'secondary' :
				// 		'default'
				// }
			/>
		</Link>
	);
}
