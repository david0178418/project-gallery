import NextLink from 'next/link';
import {
	Box,
	Chip, Link as MuiLink, Typography,
} from '@mui/material';
import { ComponentProps, forwardRef } from 'react';

interface Props {
	labels: Array<{label: string}>;
	selectedLabels: string[];
	onClick(label: string): void;
}

export default
function LabelsFilter(props: Props) {
	const {
		labels,
		selectedLabels,
		onClick,
	} = props;

	return (
		<>
			<Typography sx={{
				opacity: .6,
				fontWeight: 'bold',
			}}>
				Filter labels
			</Typography>
			{labels.map(l => (
				<Box
					key={l.label}
					marginRight={1}
					marginBottom={1}
					display="inline-block"
				>
					<Chip
						label={l.label}
						onClick={() => onClick(l.label)}
						color={
							selectedLabels.includes(l.label) ?
								'secondary' :
								'default'
						}
					/>
				</Box>
			))}
		</>
	);
}

type MuiLink = typeof MuiLink;
type NextLink = typeof NextLink;
type NextLinkProps = ComponentProps<NextLink>;
interface LinkProps extends Omit<ComponentProps<MuiLink>, 'href'> {
	href: NextLinkProps['href'];
}

export
const Link = forwardRef((props: LinkProps, ref: any) => {
	const {
		href,
		...muiProps
	} = props;

	return (
		<NextLink href={href} legacyBehavior passHref>
			<MuiLink ref={ref} {...muiProps}/>
		</NextLink>
	);
});
