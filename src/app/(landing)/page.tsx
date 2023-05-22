import TopMenuSection from './top-menu.section';
import Hero from './page.hero';
import Features from './page.features';
import { AppName, BaseUrl } from '@common/constants';
import { LogoMain } from '@common/images';
import { Metadata } from 'next';
import { urlJoin } from '@common/utils';

const SocialImageUrl = urlJoin(BaseUrl, LogoMain.src);

export const metadata: Metadata = {
	title: AppName,
	twitter: {
		creator: '@justdavidg',
		card: 'summary_large_image',
		images: [{ url: SocialImageUrl }],
	},
	openGraph: {
		type: 'website',
		locale: 'en_IE',
		url: BaseUrl,
		siteName: AppName,
		title: AppName,
		description: 'Your work, your story - Share it with the world on ProjectGallery.me!',
		images: [{ url: SocialImageUrl }],
	},
	description: 'Your work, your story - Share it with the world on ProjectGallery.me!',
};

export default
function LandingPage() {
	return (
		<>
			<TopMenuSection />
			<Hero />
			<Features />
		</>
	);
}
