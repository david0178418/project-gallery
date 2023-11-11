import { ScrollContent } from '@components/scroll-content';
import { SearchForm } from '@components/search-form';
import { fetchJournals, fetchProjects } from '@server/queries';
import JournalCard from '@components/journal-card';
import ProjectCard from '@components/project-card';
import { cn } from '@/lib/utils';

export default
async function HomePage() {
	const journals = await fetchJournals();
	const projects = await fetchProjects();

	return (
		<>
			<ScrollContent
				header={
					<div className="pt-1 pb-1">
						<div
							className={cn(
								'pb-1',
								'pl-2',
								'sm:pl-10',
								'md:pl-15',
								'lg:pl-20',
								'pr-2',
								'sm:pr-10',
								'md:pr-15',
								'lg:pr-20',
							)}
						>
							<SearchForm />
						</div>
					</div>
				}
			>
				<div className="text-lg">
					Projects
				</div>
				<div className="p-1 grid grid-cols-12 gap-1">
					{projects.slice(0, 2).map(p => (
						<div
							key={p._id.toString()}
							className="col-span-12 md:col-span-6"
						>
							{/** div hack to get around mui async child issue */}
							<div>
								<ProjectCard project={p} />
							</div>
						</div>
					))}
				</div>
				<div className="text-lg">
					Journal Posts
				</div>
				{journals.map(j => (
					<div
						key={j._id.toString()}
						className="p-1"
					>
						{/** adding extra "div" since BOX seems to be angry with an async child */}
						<div>
							<JournalCard journal={j} />
						</div>
					</div>
				))}
			</ScrollContent>
		</>
	);
}
