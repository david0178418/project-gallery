import { UsernameValidation } from '@common/types/UserCredentials';
import {
	Box, Grid, Typography,
} from '@ui';
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
						<Box
							paddingBottom={2}
							borderBottom={1}
							borderColor="divider"
						>
							<Typography sx={{
								opacity: .6,
								fontWeight: 'bold',
							}}>
								Filter labels
							</Typography>
							{uniqueLabels.map(l => (
								<LinkLabel
									key={l.label}
									label={l.label}
									path={profilePath}
									selected={selectedLabels.includes(l.label)}
									selectedLabels={selectedLabels}
								/>
							))}

						</Box>
					)}
					<Grid
						container
						padding={1}
						spacing={2}
					>
						{filteredProjects.map((p, i) => (
							<Grid
								item
								key={p._id.toString()}
								xs={12}
								sm={6}
								md={4}
								position="relative"
								sx={{
									'& .change-order-action': {
										xs: { display: 'flex' },
										// sm: { display: 'none' },
									},
									'&:hover .change-order-action': { display: 'flex' },
								}}
							>
								<Box className={`${classes.fadeInEl}`} sx={{ animationDelay: `${i * 100}ms` }}>
									{/** div hack for async component child */}
									<div>
										<ProjectCard project={p} />
										{isOwner && projects && !selectedLabels.length && (
											<Box
												bottom="75px"
												position="absolute"
												width="100%"
												className="change-order-action"
											>
												<OrderControlBlock
													first={i === 0}
													last={i === projects.length - 1}
													projectId={p._id.toString()}
												/>
											</Box>
										)}
									</div>
								</Box>
							</Grid>
						))}
					</Grid>
				</>
			)}
			{!projects.length && (
				<Typography>
					No projects yet
				</Typography>
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
				color={
					selected ?
						'secondary' :
						'default'
				}
			/>
		</Link>
	);
}
