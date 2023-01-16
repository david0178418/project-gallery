import Head from 'next/head';
import { useRouteBackDefault } from '@common/hooks';
import { ScrollContent } from '@components/scroll-content';
import { BackIcon } from '@components/icons';
import { GetServerSideProps } from 'next';
import { getServerSession } from '@server/auth-options';
import { fetchProject } from '@server/queries';
import { dbProjectToUiProject, uiProjectToWriteProject } from '@server/transforms';
import { UiProject } from '@common/types/Project';
import { MongoIdValidation } from '@server/validations';
import EditProjectForm, { projectIsValid } from '@components/forms/edit-project.form';
import { CancelButton, ConfirmButton } from '@components/common/buttons';
import { useSetAtom } from 'jotai';
import { loadingAtom, pushToastMsgAtom } from '@common/atoms';
import { projectSave } from '@client/api-calls';
import { useCallback, useState } from 'react';
import { AppName, SpecialCharacterCodes } from '@common/constants';
import {
	Box,
	Container,
	IconButton,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material';

interface Props {
	project: UiProject | null;
}

export
const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
	const result = await MongoIdValidation.safeParseAsync(ctx.query.projectId);
	const session = await getServerSession(ctx.req, ctx.res);

	if(!result.success) {
		return {
			props: {
				session,
				project: null,
			},
		};
	}

	const id = result.data;
	const project = await fetchProject(id);

	return {
		props: {
			session,
			project: project && dbProjectToUiProject(project),
		},
	};
};

export default
function Page(props: Props) {
	const { project: defaultProject	} = props;
	const [project, setProject] = useState(() => defaultProject && uiProjectToWriteProject(defaultProject));
	const setLoading = useSetAtom(loadingAtom);
	const pushToastMsg = useSetAtom(pushToastMsgAtom);
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const routeBack = useRouteBackDefault();
	const title = `${defaultProject?.title} - Edit` || 'Not Found';

	const handleSave = useCallback(async () => {
		if(!project) {
			return null;
		}

		try {
			setLoading(true);
			await projectSave(project);
			routeBack();
		} catch(e: any) {
			const { errors = ['Something went wrong. Try again.'] } = e;

			errors.map(pushToastMsg);
			console.log(e);
		}

		setLoading(false);
	}, [project]);

	return (
		<>
			<Head>
				<title>{AppName} - {title}</title>
			</Head>
			<ScrollContent
				header={
					<Box sx={{
						paddingTop: 1,
						paddingBottom: 2,
					}}>
						<Typography variant="h5" component="div" gutterBottom>
							{/** TODO Capture direct links and send them to home page */}
							<IconButton color="primary" onClick={routeBack}>
								<BackIcon />
							</IconButton>{SpecialCharacterCodes.NBSP}
							{title}
						</Typography>
					</Box>
				}
			>
				<Container>

					{project && (
						<EditProjectForm
							project={project}
							onChange={setProject}
						/>
					)}
					<Box paddingTop={2} textAlign="right">
						<CancelButton
							fullWidth={fullScreen}
							onClick={routeBack}
						/>
						<Box
							sx={{
								display: {
									xs: 'block',
									md: 'inline-block',
								},
								paddingLeft: { md: 2 },
								paddingTop: {
									xs: 2,
									md: 0,
								},
								paddingBottom: 20,
							}}
						>
							<ConfirmButton
								onClick={handleSave}
								fullWidth={fullScreen}
								disabled={!(project && projectIsValid(project))}
							/>
						</Box>
					</Box>
				</Container>
			</ScrollContent>
		</>
	);
}
