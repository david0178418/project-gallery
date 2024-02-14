import { Fragment } from 'react';
import { ProfileLinkButton } from './profile-button';
import ProfileCustomTextItem from './profile-custom-item-button';
import { Box } from '@mui/material';
import MarkdownContent from './markdown-content';
import { CustomProfileItem } from '@common/types/CustomLink';

interface Props {
	item: CustomProfileItem;
}

export default
function CustomItem({ item }: Props) {
	return (
		<Fragment>
			{item.type === 'link' && (
				<ProfileLinkButton
					href={item.value}
					target="_blank"
				>
					{item.label}
				</ProfileLinkButton>
			)}
			{item.type === 'text' && (
				<ProfileCustomTextItem label={item.label}>
					<Box
						display="inline-block"
						maxWidth={600}
						width="100%"
						textAlign="left"
						marginBottom={2}
					>
						<MarkdownContent>
							{item.value}
						</MarkdownContent>
					</Box>
				</ProfileCustomTextItem>
			)}
		</Fragment>
	);
}
