import { UsernameValidation } from '@common/types/UserCredentials';
import { fetchUser, fetchUserGallery } from '@server/queries';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Paths } from '@common/constants';
import { ProfileLinkButton } from '@components/profile-button';
import { ProjectIcon } from '@components/icons';

interface Props {
	params: Promise<{
		username: string;
		profilePage: string;
	}>;
}

export default
async function UserProjectsPage(props: Props) {
	const { username: routeUsername } = await props.params;
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
		<>
			<Box textAlign="center">
				{!!projects.length && (
					<>
						{projects.map((p) => (
							<ProfileLinkButton
								icon={ProjectIcon}
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
		</>
	);
}
