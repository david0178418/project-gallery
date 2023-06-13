'use client';
import { ReactNode } from 'react';
import { useSelectedLayoutSegment } from 'next/navigation';
import { Session } from 'next-auth';
import { LeftRail } from './left-rail';
import { BottomNav } from './bottom-nav';
import { Container, Grid } from '@ui';

interface Props {
	session: Session | null;
	children?: ReactNode;
}

export
function PageFrame(props: Props) {
	const segment = useSelectedLayoutSegment();
	const {
		children,
		session,
	} = props;

	return (
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
					<div>
						{/** Wrapped in a random div due to this issue:
							 * https://stackoverflow.com/questions/56347839/material-ui-v4-0-1-warning-expected-an-element-that-can-hold-a-ref
							 */}
						<LeftRail
							session={session}
							segment={segment || ''}
						/>
					</div>
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
	);
}
