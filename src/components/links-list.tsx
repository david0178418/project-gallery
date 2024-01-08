
import { CustomLink } from '@common/types/CustomLink';
import { moveItemLeft, moveItemRight } from '@common/utils';
import IconButton from '@mui/material/IconButton';
import MuiLink from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
	ArrowDownIcon,
	ArrowUpIcon,
	DeleteIcon,
} from '@components/icons';

interface Props {
	links: CustomLink[];
	onRemove(linkIndex: number): void;
	onUpdate(newList: CustomLink[]): void
}

export default
function LinksList(props: Props) {
	const {
		links,
		onRemove,
		onUpdate,
	} = props;

	function handleMoveleft(index: number) {
		onUpdate(moveItemLeft(links, index));
	}

	function handleMoveRight(index: number) {
		onUpdate(moveItemRight(links, index));
	}

	return (
		<List>
			{links.map((l, i) => (
				<ListItem key={i}>
					{i !== 0 && (
						<ListItemIcon>
							<IconButton onClick={() => handleMoveleft(i)}>
								<ArrowUpIcon />
							</IconButton>
						</ListItemIcon>
					)}
					{(i !== (links.length - 1)) && (
						<ListItemIcon>
							<IconButton onClick={() => handleMoveRight(i)}>
								<ArrowDownIcon />
							</IconButton>
						</ListItemIcon>
					)}
					<ListItemText>
						<MuiLink href={l.url} target="_blank">
							{l.label}
						</MuiLink>
					</ListItemText>
					<ListItemIcon>
						<IconButton onClick={() => onRemove(i)}>
							<DeleteIcon />
						</IconButton>
					</ListItemIcon>
				</ListItem>
			))}
		</List>
	);
}
