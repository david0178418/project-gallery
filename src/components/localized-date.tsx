interface Props {
	date: string | Date;
	includeTime?: boolean;
}

export
function LocalizedDate(props: Props) {
	const {
		date,
		includeTime,
	} = props;

	return (
		<span suppressHydrationWarning={true}>
			{localizedDateFormat(date, includeTime)}
		</span>
	);
}

function localizedDateFormat(date: string | Date, includeTime?: boolean) {
	return new Intl.DateTimeFormat('en-US', {
		dateStyle: 'long',
		timeStyle: includeTime ? 'short' : undefined,
	}).format(new Date(date));
}
