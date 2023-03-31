interface Props {
	date: string;
}

export
function LocalizedDate(props: Props) {
	const { date } = props;

	return (
		<span suppressHydrationWarning={true}>
			{localizedDateFormat(date)}
		</span>
	);
}

function localizedDateFormat(date: string) {
	return (new Date(date)).toLocaleDateString('en-US', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});
}
