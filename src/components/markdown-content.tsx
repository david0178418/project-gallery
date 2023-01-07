
import ReactMarkdown from 'react-markdown';

interface Props {
	children: string;
}

export
function MarkdownContent(props: Props) {
	const { children } = props;

	return (
		<ReactMarkdown className="parsed-user-content">
			{children}
		</ReactMarkdown>
	);
}

export default MarkdownContent;
