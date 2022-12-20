import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import {
	AppName, MaxSearchTermSize, Paths,
} from '@common/constants';
import { ScrollContent } from '@components/scroll-content';
import { SearchForm } from '@components/search-form';
import {
	Box,
	Container,
	Typography,
} from '@mui/material';
import { getServerSession } from '@server/auth-options';

interface Props {
	searchTerm: string;
}

export
const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
	const rawTerm = ctx.query?.q || '';
	const foo = Array.isArray(rawTerm) ?
		rawTerm.join() :
		rawTerm;
	const searchTerm = foo.substring(0, MaxSearchTermSize);

	if(!searchTerm) {
		return {
			redirect: {
				permanent: false,
				destination: Paths.Home,
			},
		};
	}

	const session = await getServerSession(ctx.req, ctx.res);

	return {
		props: {
			session,
			searchTerm,
		},
	};
};

const SearchPage: NextPage<Props> = (props) => {
	const { searchTerm } = props;

	return (
		<Container>
			<Head>
				<title>{AppName}</title>
				<meta name="description" content={AppName} />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<ScrollContent
				header={
					<Box sx={{
						paddingTop: 1,
						paddingBottom: 1,
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
					}}>
						<SearchForm
							placeholder={`Search ${AppName}`}
							value={searchTerm}
						/>
						<Box paddingTop={1}>
							<Typography>
								{`No Results for "${searchTerm}"`}
							</Typography>
						</Box>
					</Box>
				}
			>
				TODO!
			</ScrollContent>
		</Container>
	);
};

export default SearchPage;
