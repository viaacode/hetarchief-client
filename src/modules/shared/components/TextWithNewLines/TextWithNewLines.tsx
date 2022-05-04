import DOMPurify from 'dompurify';
import { FC } from 'react';

import { RICH_TEXT_SANITIZATION } from '@shared/const';

interface TextWithNewLinesProps {
	text: string | null | undefined;
	className?: string;
}

const TextWithNewLines: FC<TextWithNewLinesProps> = ({ text, className }) => {
	if (!text) {
		return null;
	}
	return (
		<div
			className={className}
			dangerouslySetInnerHTML={{
				__html: String(
					DOMPurify.sanitize(
						// Replace new lines and literal new lines (description and abstract are encoded differently)
						text.replaceAll('\\n', '<br/>').replaceAll('\n', '<br/>'),
						RICH_TEXT_SANITIZATION
					)
				),
			}}
		/>
	);
};

export default TextWithNewLines;
