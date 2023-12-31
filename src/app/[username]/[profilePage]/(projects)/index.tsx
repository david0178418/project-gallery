import { UsernameValidation } from '@common/types/UserCredentials';
import { fetchUser, fetchUserGallery } from '@server/queries';
import ProjectCard from '@components/project-card';
import { getServerSession } from '@server/auth-options';
import OrderControlBlock from './order-control';
import classes from './projects.module.css';
import {
	Box,
	Grid,
	Typography,
} from '@ui';

interface Props {
	username: string;
}

export default
async function UserProjectsPage(props: Props) {
	const { username: routeUsername } = props;
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
	const projects = await fetchUserGallery(username);
	const isOwner = !!username && (username === session?.user.username);

	return (
		<>
			{!!projects.length && (
				<>
					<Grid
						container
						padding={1}
						spacing={2}
					>
						{projects.map((p, i) => (
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
										{isOwner && projects && (
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
