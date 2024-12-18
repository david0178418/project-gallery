import { ReactNode } from 'react';
import { LeftRail } from './page-frame/left-rail';
import { BottomNav } from './page-frame/bottom-nav';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import CommonStuff from './common-stuff';
import ThemeComponent from '@app/theme-component';

interface Props {
	children?: ReactNode;
}

export default
function ContentLayout(props: Props) {
	const { children } = props;

	return (
		<ThemeComponent>
			<Container
				sx={{
					display: 'flex',
					height: '100vh',
					overflow: 'hidden',
					paddingX: {
						xs: 0,
						sm: 1,
						lg: 2,
					},
				}}
			>
				<Grid
					container
					columns={16}
					spacing={2}
					marginY={0}
				>
					<Grid
						size={{
							sm: 2,
							md: 4,
						}}
						sx={{
							display: {
								xs: 'none',
								sm: 'block',
							},
						}}
					>
						<div>
							{/** Wrapped in a random div due to this issue:
							 * https://stackoverflow.com/questions/56347839/material-ui-v4-0-1-warning-expected-an-element-that-can-hold-a-ref
							 */}
							<LeftRail />
						</div>
					</Grid>
					<Grid
						size={{
							xs: 16,
							sm: 14,
							md: 12,
						}}
						style={{
							maxHeight: '100%',
							overflow: 'hidden',
							position: 'relative',
						}}
					>
						{children}
					</Grid>
				</Grid>
				{/** div hack for async component child */}
				<div>
					<BottomNav/>
				</div>
				<CommonStuff/>
			</Container>
		</ThemeComponent>
	);
}
