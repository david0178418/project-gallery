import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getServerSession } from '@server/auth-options';
import { AppName } from '@common/constants';
import { ScrollContent } from '@components/scroll-content';
import PorjectCard from '@components/project-card';
import { random } from '@common/utils';
import { SearchForm } from '@components/search-form';
import { UiProject } from '@common/types/Project';
import {
	Box,
	Grid,
} from '@mui/material';
import { fetchProjects } from '@server/queries';
import { dbProjectToUiProject } from '@server/transforms';

interface Props {
	projects: UiProject[];
}

const dummyProjects: UiProject[] = [
	{
		_id: 'asdfasdfasdf',
		createdDate: new Date().toISOString(),
		ownerId: 'asfdasdfa',
		lastUpdatedDate: new Date().toISOString(),
		projectCreatedDate: new Date().toISOString(),
		projectLastUpdatedDate: new Date().toISOString(),
		title: 'My Awesome Title',
		titleImageUrl: `https://placebacon.net/400/300?image=${random(0, 9)}`,
		summary: 'Anotbher awesome Project #hashtagtest',
		detail: 'Detail. Lots and lots and loooooots of details. Detail. Lots and lots and loooooots of details. Detail. Lots and lots and loooooots of details. Detail. Lots and lots and loooooots of details. Detail. Lots and lots and loooooots of details. Detail. Lots and lots and loooooots of details. ',
	}, {
		_id: 'fadsgsdfsd',
		createdDate: new Date().toISOString(),
		ownerId: 'asfdasdfa',
		lastUpdatedDate: new Date().toISOString(),
		projectCreatedDate: new Date().toISOString(),
		projectLastUpdatedDate: new Date().toISOString(),
		title: 'My Awesome Title',
		titleImageUrl: `https://placebacon.net/400/300?image=${random(0, 9)}`,
		summary: 'My Awesome Project Summary https://twitter.com',
		detail: 'Detail. Lots and lots and loooooots of details. Detail. Lots and lots and loooooots of details. Detail. Lots and lots and loooooots of details. Detail. Lots and lots and loooooots of details. Detail. Lots and lots and loooooots of details. Detail. Lots and lots and loooooots of details. ',
	}, {
		_id: '11b231j2k',
		createdDate: new Date().toISOString(),
		ownerId: 'asfdasdfa',
		lastUpdatedDate: new Date().toISOString(),
		projectCreatedDate: new Date().toISOString(),
		projectLastUpdatedDate: new Date().toISOString(),
		title: 'My Awesome Title',
		titleImageUrl: `https://placebacon.net/400/300?image=${random(0, 9)}`,
		summary: 'My Awesome Project Summary',
		detail: 'Detail. Lots and lots and loooooots of details. Detail. Lots and lots and loooooots of details. Detail. Lots and lots and loooooots of details. Detail. Lots and lots and loooooots of details. Detail. Lots and lots and loooooots of details. Detail. Lots and lots and loooooots of details. ',
	}, {
		_id: '11b2gasdfasdfasd31j2k',
		createdDate: new Date().toISOString(),
		ownerId: 'asfdasdfa',
		lastUpdatedDate: new Date().toISOString(),
		projectCreatedDate: new Date().toISOString(),
		projectLastUpdatedDate: new Date().toISOString(),
		title: 'My Awesome Title',
		titleImageUrl: `https://placebacon.net/400/300?image=${random(0, 9)}`,
		summary: 'My Awesome Project Summary',
		detail: 'Detail. Lots and lots and loooooots of details. Detail. Lots and lots and loooooots of details. Detail. Lots and lots and loooooots of details. Detail. Lots and lots and loooooots of details. Detail. Lots and lots and loooooots of details. Detail. Lots and lots and loooooots of details. ',
	}, {
		_id: '11b2gasdffasd31j2k',
		createdDate: new Date().toISOString(),
		ownerId: 'asfdasdfa',
		lastUpdatedDate: new Date().toISOString(),
		projectCreatedDate: new Date().toISOString(),
		projectLastUpdatedDate: new Date().toISOString(),
		title: 'My Awesome Title',
		titleImageUrl: `https://placebacon.net/400/300?image=${random(0, 9)}`,
		summary: 'My Awesome Project Summary',
		detail: 'Detail. Lots and lots and loooooots of details. Detail. Lots and lots and loooooots of details. Detail. Lots and lots and loooooots of details. Detail. Lots and lots and loooooots of details. Detail. Lots and lots and loooooots of details. Detail. Lots and lots and loooooots of details. ',
	}, {
		_id: '11b2gasgsagasasdfasd31j2k',
		createdDate: new Date().toISOString(),
		ownerId: 'asfdasdfa',
		lastUpdatedDate: new Date().toISOString(),
		projectCreatedDate: new Date().toISOString(),
		projectLastUpdatedDate: new Date().toISOString(),
		title: 'My Awesome Title',
		titleImageUrl: `https://placebacon.net/400/300?image=${random(0, 9)}`,
		summary: 'My Awesome Project Summary',
		detail: 'Detail. Lots and lots and loooooots of details. Detail. Lots and lots and loooooots of details. Detail. Lots and lots and loooooots of details. Detail. Lots and lots and loooooots of details. Detail. Lots and lots and loooooots of details. Detail. Lots and lots and loooooots of details. ',
	},
];

export
const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
	const session = await getServerSession(ctx.req, ctx.res);
	const dbProjects = await fetchProjects() || [];

	return {
		props: {
			session,
			projects: dbProjects.map(dbProjectToUiProject).concat(dummyProjects),
		},
	};
};

export default function Home(props: Props) {
	const { projects } = props;

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
						{/* TODO <HomeSortTabs /> */}
					</Box>
				}
			>
				<Grid padding={1} container spacing={1} >
					{projects.map(p => (
						<Grid
							key={p._id}
							item
							xs={12}
							md={6}
						>
							<PorjectCard
								project={p}
							/>
						</Grid>
					))}
				</Grid>
			</ScrollContent>
		</>
	);
}
