
import ReactMarkdown from 'react-markdown';

interface Props {
	children: string;
}

export
function MarkdownContent(props: Props) {
	const { children } = props;

	return (
		<>
			<ReactMarkdown>
				{children}
			</ReactMarkdown>
		</>
	);
}

export default MarkdownContent;
