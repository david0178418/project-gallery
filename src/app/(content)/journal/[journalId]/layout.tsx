import { ScrollContent } from '@components/scroll-content';
import { fetchJournal } from '@server/queries';
import { MongoIdValidation } from '@server/validations';
import { urlJoin } from '@common/utils';
import { Metadata } from 'next';
import BackButton from '@components/back-button';
import { ReactNode } from 'react';
import {
	AppName,
	BaseUrl,
	Paths,
	SpecialCharacterCodes,
} from '@common/constants';

export
async function generateMetadata(props: Props): Promise<Metadata> {
	const { params: { journalId } } = props;

	const result = await MongoIdValidation.safeParseAsync(journalId);
	const journal = result.success ?
		await fetchJournal(journalId) :
		null;

	if(!journal) {
		return {};
	}

	return {
		openGraph: {
			type: 'article',
			url: urlJoin(BaseUrl, Paths.Journal(journalId)),
			images: [],
			publishedTime: journal.publishedDate || '',
			modifiedTime: journal.lastUpdatedDate || '',
			authors: journal.owner.username,
		},
		title: `${journal.title} - ${AppName}`,
		description: journal.body.slice(0, 300),
		twitter: { card: 'summary' },
	};
}

interface Props {
	children: ReactNode;
	params: {
		journalId: string;
	};
}

export default
async function Journal(props: Props) {
	const {
		children,
		params: { journalId },
	} = props;

	const result = await MongoIdValidation.safeParseAsync(journalId);
	const journal = result.success ?
		await fetchJournal(journalId) :
		null;

	if(!journal) {
		return (
			<div>
				Invalid Journal
			</div>
		);
	}

	const defaultBackPath = journal.project ?
		Paths.ProjectJournals(journal.project._id.toString()) :
		Paths.UserGalleryJournals(journal.owner.username);

	return (
		<>
			<ScrollContent
				header={
					<div className="pt-1 pb-2">
						<h5 className="mb-2">
							{/** TODO Capture direct links and send them to home page */}
							<BackButton
								defaultHref={defaultBackPath}
							/>{SpecialCharacterCodes.NBSP}
							{journal.title || 'Not Found'}
						</h5>
					</div>
				}
			>
				{children}
			</ScrollContent>
		</>
	);
}
