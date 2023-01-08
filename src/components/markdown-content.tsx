
import ReactMarkdown from 'react-markdown';

interface Props {
	plaintext?: boolean;
	children: string;
}

export
function MarkdownContent(props: Props) {
	const {
		plaintext,
		children,
	} = props;

	const modeProps = plaintext ? {
		unwrapDisallowed: true,
		allowedElements: [],
	} : {};

	return (
		<ReactMarkdown
			{...modeProps}
			className="parsed-user-content"
		>
			{children}
		</ReactMarkdown>
	);
}

export default MarkdownContent;
