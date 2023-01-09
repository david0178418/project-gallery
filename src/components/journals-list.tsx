import { Paths } from '@common/constants';
import { UiJournal } from '@common/types/Journal';
import { red } from '@mui/material/colors';
import MarkdownContent from '@components/markdown-content';
import { Fragment } from 'react';
import Link from 'next/link';
import {
	Avatar,
	Divider,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Typography,
} from '@mui/material';

interface Props {
	journals: UiJournal[];
}

export default
function JournalsList(props: Props) {
	const { journals } = props;

	return (
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
										{j.title}
									</Link>
								</>
							}
							secondaryTypographyProps={{
								component: 'div',
								maxHeight: 80,
								overflow: 'hidden',
							}}
							secondary={
								<>
									{j.project && (
										<Link href={Paths.Project(j.project._id)}>
											<Typography variant="subtitle2">
											Project: {j.project.title}
											</Typography>
										</Link>
									)}
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
	);
}
