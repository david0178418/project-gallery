import { DbJournal } from '@common/types/Journal';
import Link from 'next/link';
import { Paths } from '@common/constants';
import MarkdownContent from './markdown-content';
import { ShareIconButton } from './common/share-button';
import { LocalizedDate } from './localized-date';
import { getServerSession } from '@server/auth-options';
import { fetchUserProfileByUsername } from '@server/queries';
import { FavoriteIcon, EditIcon } from '@components/icons';
import Tooltip from './common/tooltip';
import { Button } from './ui/button';
import Card from './common/card';
import Avatar from './common/avatar';

interface Props {
	journal: DbJournal;
}

export default
async function JournalCard(props: Props) {
	const session = await getServerSession();
	const user = session?.user;
	const {
		journal: {
			_id,
			body,
			title,
			publishedDate,
			project,
			owner: {
				_id: ownerId,
				username,
			},
		},
	} = props;
	const profile = await fetchUserProfileByUsername(username);
	const journaId = _id.toString();
	const isOwner = user?.id === ownerId.toString();
	const journalUrl = Paths.Journal(journaId);

	return (
		<Card
			title={
				<>

					<Link prefetch={false} href={Paths.UserGallery(username)}>
						<Tooltip label={username}>
							<Avatar
								src={profile?.avatar}
								fallback={username[0].toLocaleUpperCase()}
							/>
						</Tooltip>
					</Link>
					<div className="hover:underline">
						<Link prefetch={false} href={journalUrl}>
							{title}
						</Link>
					</div>
				</>
			}
			description={

				<Link prefetch={false} href={journalUrl}>
					{publishedDate && (
						<LocalizedDate date={publishedDate} />
					)}
				</Link>
			}
			footer={
				<>
					<Tooltip label="Favorite">
						<Button>
							<FavoriteIcon />
						</Button>
					</Tooltip>
					<ShareIconButton
						url={Paths.Journal(journaId)}
						label={title}
						shareMsg="Check out this project journal post!"
					/>
					{isOwner && (
						<Link prefetch={false} href={Paths.JournalEdit(journaId)}>
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
			{project && (
				<div className="hover:underline">
					<Link prefetch={false} href={Paths.Project(project._id.toString())}>
						<div>
								Project: {project.title}
						</div>
					</Link>
				</div>
			)}
			{!project && (
				<div>
						Personal Post
				</div>
			)}
			<div
				className="font-bold h-56 overflow-hidden"
				style={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }}
			>
				<MarkdownContent plaintext>
					{body}
				</MarkdownContent>
			</div>
		</Card>
	);
}
