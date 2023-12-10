import TopBar from './page.top-bar';
import Hero from './page.hero';
import Features from './page.features';

export default
function LandingPage() {
	return (
		<>
			<TopBar />
			<div className="mt-40">
				<Hero />
			</div>
			<Features />
		</>
	);
}
