import NextLink from 'next/link';
import { Link as MuiLink, Typography } from '@ui';
import { ComponentProps, forwardRef } from 'react';
import Label from './label';

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
				<Label
					key={l.label}
					label={l.label}
					onClick={() => onClick(l.label)}
					color={
						selectedLabels.includes(l.label) ?
							'secondary' :
							'default'
					}
				/>
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
