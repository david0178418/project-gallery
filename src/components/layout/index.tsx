import { ReactNode } from 'react';

import { LeftRail } from './left-rail';
import { BottomNav } from './bottom-nav';
import {
	Container,
	Grid,
} from '@ui';

interface Props {
	children?: ReactNode;
}

export
function Layout(props: Props) {
	const { children } = props;

	return (
		<>
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
						item
						sm={2}
						md={4}
						sx={{
							display: {
								xs: 'none',
								sm: 'block',
							},
						}}
					>
						<LeftRail/>
					</Grid>
					<Grid
						item
						xs={16}
						sm={14}
						md={12}
						style={{
							maxHeight: '100%',
							overflow: 'hidden',
							position: 'relative',
						}}
					>
						{children}
					</Grid>
				</Grid>
				<BottomNav/>
			</Container>
		</>
	);
}
