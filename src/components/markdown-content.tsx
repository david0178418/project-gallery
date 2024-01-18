import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import remarkGfm from 'remark-gfm';

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
			remarkPlugins={[remarkGfm]}
			className="parsed-user-content"
			components={{
				code(codeProps) {
					const {
						className,
						children: codeChildren,
						// eslint-disable-next-line @typescript-eslint/no-unused-vars
						ref,
						// eslint-disable-next-line @typescript-eslint/no-unused-vars
						style,
						...rest
					} = codeProps;
					const match = /language-(\w+)/.exec(className || '');
					const lang = match?.[1];

					return lang ? (
						<SyntaxHighlighter
							{...rest}
							lang={match?.[1]}
						>
							{String(codeChildren).replace(/\n$/, '')}
						</SyntaxHighlighter>
					) : (
						<code {...rest} className={className}>
							{codeChildren}
						</code>
					);
				},
			}}
		>
			{children}
		</ReactMarkdown>
	);
}

export default MarkdownContent;
