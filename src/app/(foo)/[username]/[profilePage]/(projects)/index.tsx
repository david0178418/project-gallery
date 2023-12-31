import { UsernameValidation } from '@common/types/UserCredentials';
import { fetchUser, fetchUserGallery } from '@server/queries';
import { Box, Typography } from '@ui';
import ProfileButton from '@app/[username]/profile-button';
import { Paths } from '@common/constants';

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

	const projects = await fetchUserGallery(username);

	return (
		<Box textAlign="center">
			{!!projects.length && (
				<>
					{projects.map((p) => (
						<ProfileButton
							key={p._id.toString()}
							href={Paths.Project(p._id.toString())}
						>
							{p.title}
						</ProfileButton>
					))}
				</>
			)}
			{!projects.length && (
				<Typography>
					No projects yet
				</Typography>
			)}
		</Box>
	);
}
