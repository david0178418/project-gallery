import { DbProject, UiProject } from '@common/types/Project';
import { ParsedContent } from './parsed-content';
import Link from 'next/link';
import { Paths } from '@common/constants';
import { ShareIconButton } from './common/share-button';
import { getServerSession } from '@server/auth-options';
import Tooltip from './common/tooltip';
import Image from 'next/image';
import Card from './common/card';
import { Button } from './ui/button';
import {
	FavoriteIcon,
	JournalIcon,
	EditIcon,
} from '@components/icons';

interface Props {
	project: DbProject | UiProject;
}

export default
async function ProjectCard(props: Props) {
	const {
		project: {
			_id,
			description,
			lastJournalEntry,
			title,
			images,
			owner,
		},
	} = props;
	const session = await getServerSession();
	const isOwner = session?.user?.id === owner._id.toString();
	const projectUrl = Paths.Project(_id.toString());

	return (
		<Card
			footer={
				<>
					<Tooltip label="Favorite">
						<Button>
							<FavoriteIcon />
						</Button>
					</Tooltip>
					<ShareIconButton
						label={title}
						url={projectUrl}
						shareMsg="Check out this project!"
					/>
					{lastJournalEntry && (
						<Link
							shallow
							href={Paths.Journal(lastJournalEntry._id.toString())}
						>
							<Tooltip label={lastJournalEntry.title}>
								<Button>
									<JournalIcon />
								</Button>
							</Tooltip>
						</Link>
					)}
					{isOwner && (
						<Link
							shallow
							href={Paths.ProjectEdit(_id.toString())}
						>
							<Tooltip label="Edit">
								<Button>
									<EditIcon />
								</Button>
							</Tooltip>
						</Link>
					)}
				</>
			}
		>
			<div>
				<Link href={projectUrl}>
					<Image
						height={100}
						width={100}
						src={images?.[0].url}
						className="aspect-video"
						alt=""
					/>
				</Link>
			</div>
			<div className="strong">
				{title}
			</div>
			<div className="text-md italic">
					created by {owner.username}
			</div>
			<div
				className="overflow-hidden h-52"
				style={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }}
			>
				<ParsedContent>
					{description}
				</ParsedContent>
			</div>
		</Card>
	);
}
