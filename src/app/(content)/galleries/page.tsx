import { Paths, ProfileActivity } from '@common/constants';
import { LocalizedDate } from '@components/localized-date';
import { ScrollContent } from '@components/scroll-content';
import { fetchUserProfiles } from '@server/queries';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const ProfileActivityLabels = {
	[ProfileActivity.JournalCreate]: (id: string, title: string) => (
		<Link href={Paths.Journal(id)}>
			{`Journal post "${title}" created.`}
		</Link>
	),
	[ProfileActivity.JournalUpdate]: (id: string, title: string) => (
		<Link href={Paths.Journal(id)}>
			{`Journal post "${title}" updated.`}
		</Link>
	),
	[ProfileActivity.ProfileCreate]: (id: string, username: string) => (
		<Link href={Paths.UserGallery(username)}>
			{`${username} created a gallery.`}
		</Link>
	),
	[ProfileActivity.ProfileUpdate]: (id: string, username: string) => (
		<Link href={Paths.UserGallery(username)}>
			{`${username}'s gallery updated.`}
		</Link>
	),
	[ProfileActivity.ProjectCreate]: (id: string, title: string) => (
		<Link href={Paths.Project(id)}>
			{`Project "${title}" created.`}
		</Link>
	),
	[ProfileActivity.ProjectUpdate]: (id: string, title: string) => (
		<Link href={Paths.Project(id)}>
			{`Project "${title}" updated.`}
		</Link>
	),
};

export default
async function GalleriesPage() {
	const galleries = await fetchUserProfiles();

	return (
		<ScrollContent>
			{galleries.map(gallery => (
				<div
					key={gallery._id.toString()}
					className={cn(
						'py-2',
						'[&:not(:last-child)]:border-b-1',
						'border-gray-500',
					)}
				>
					<div className="text-lg mb-2">
						<Link href={Paths.UserGallery(gallery.username)}>
							{`${gallery.username}'s gallery`}
						</Link>
					</div>
					<div>
						{ProfileActivityLabels[gallery.lastActivity.type](
							gallery.lastActivity.id.toString(),
							gallery.lastActivity.label,
						)}
					</div>
					<div className="pt-1">
						<LocalizedDate includeTime date={gallery.lastActivity.date} />
					</div>
				</div>
			))}
		</ScrollContent>
	);
}
