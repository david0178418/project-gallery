import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getServerSession } from '@server/auth-options';
import { AppName, Paths } from '@common/constants';
import { ScrollContent } from '@components/scroll-content';
import ProjectCard from '@components/project-card';
import { SearchForm } from '@components/search-form';
import { UiProject } from '@common/types/Project';
import { UiJournal } from '@common/types/Journal';
import { fetchJournals, fetchProjects } from '@server/queries';
import { dbJournalToUiJournal, dbProjectToUiProject } from '@server/transforms';
// import JournalCard from '@components/journal-card';
import { red } from '@mui/material/colors';
import {
	Avatar,
	Box,
	Divider,
	Grid,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Typography,
} from '@mui/material';
import MarkdownContent from '@components/markdown-content';
import { Fragment } from 'react';
import { formatDate } from '@common/utils';
import Link from 'next/link';

interface Props {
	projects: UiProject[];
	journals: UiJournal[];
}

export
const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
	const session = await getServerSession(ctx.req, ctx.res);
	const projects = (await fetchProjects()).map(dbProjectToUiProject);
	const journals = (await fetchJournals()).map(dbJournalToUiJournal);

	return {
		props: {
			session,
			projects,
			journals,
		},
	};
};

export default function Home(props: Props) {
	const {
		projects,
		journals,
	} = props;

	return (
		<>
			<Head>
				<title>{AppName}</title>
				<meta name="description" content={AppName} />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<ScrollContent
				header={
					<Box
						sx={{
							paddingTop: 1,
							paddingBottom: 1,
						}}
					>
						<Box
							paddingBottom={1}
							sx={{
								paddingLeft: {
									xs: 2,
									sm: 10,
									md: 15,
									lg: 20,
								},
								paddingRight: {
									xs: 2,
									sm: 10,
									md: 15,
									lg: 20,
								},
							}}
						>
							<SearchForm />
						</Box>
					</Box>
				}
			>
				<Typography variant="h6">
					Projects
				</Typography>
				<Grid padding={1} container spacing={1} >
					{projects.slice(0, 2).map(p => (
						<Grid
							key={p._id}
							item
							xs={12}
							md={6}
						>
							<ProjectCard
								project={p}
							/>
						</Grid>
					))}
				</Grid>
				<Typography variant="h6">
					Journal Posts
				</Typography>
				<List>
					{journals.map(j => (
						<Fragment key={j._id}>
							<ListItem alignItems="flex-start">
								<ListItemAvatar>
									<Link href={Paths.UserJournals(j.owner.username)}>
										<Avatar sx={{ bgcolor: red[500] }}>
											{j.owner.username[0].toLocaleUpperCase()}
										</Avatar>
									</Link>
								</ListItemAvatar>
								<ListItemText
									primary={
										<>

											<Link href={Paths.Journal(j._id)}>
												<>
													{j.title}
													{j.publishedDate && (
														<Typography variant="subtitle2">
															{formatDate(j.publishedDate)}
														</Typography>
													)}
												</>
											</Link>
										</>
									}
									secondaryTypographyProps={{
										component: 'div',
										maxHeight: 40,
										overflow: 'hidden',
									}}
									secondary={
										<>
											<MarkdownContent plaintext>
												{j.body}
											</MarkdownContent>
										</>
									}
								/>
							</ListItem>
							<Divider variant="inset" component="li" />
						</Fragment>
					))}
				</List>
				{/* <Grid padding={1} container spacing={1} >
					{journals.map(j => (
						<Grid
							key={j._id}
							item
							xs={12}
							md={6}
						>
							<JournalCard
								journal={j}
							/>
						</Grid>
					))}
				</Grid> */}
			</ScrollContent>
		</>
	);
}
