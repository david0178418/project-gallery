
import { DeleteIcon } from '@components/icons';
import { UiProject } from '@common/types/Project';
import {
	IconButton,
	Link as MuiLink,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
} from '@mui/material';

interface Props {
	links: UiProject['links'][number][];
	onRemove?(linkIndex: number): void;
}

export default
function LinksList(props: Props) {
	const {
		links,
		onRemove,
	} = props;

	return (
		<List>
			{links.map((l, i) => (
				<ListItem key={i}>
					{onRemove && (
						<ListItemIcon>
							<IconButton onClick={() => onRemove(i)}>
								<DeleteIcon />
							</IconButton>
						</ListItemIcon>
					)}
					<ListItemText>
						<MuiLink href={l.url} target="_blank">
							{l.label}
						</MuiLink>
					</ListItemText>
				</ListItem>
			))}
		</List>
	);
}
