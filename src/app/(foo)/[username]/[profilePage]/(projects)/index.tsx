import { UsernameValidation } from '@common/types/UserCredentials';
import { fetchUser, fetchUserGallery } from '@server/queries';
import { Box, Typography } from '@ui';
import { Paths } from '@common/constants';
import { ProfileLinkButton } from '@components/profile-button';

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
			<ProfileLinkButton href={Paths.UserGallery(username)}>
				Gallery Home
			</ProfileLinkButton>
			{!!projects.length && (
				<>
					{projects.map((p) => (
						<ProfileLinkButton
							key={p._id.toString()}
							href={Paths.Project(p._id.toString())}
						>
							{p.title}
						</ProfileLinkButton>
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
