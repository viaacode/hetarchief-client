import { FC } from 'react';

import Html from '@shared/components/Html/Html';

interface TextWithNewLinesProps {
	text: string | null | undefined;
	className?: string;
}

const TextWithNewLines: FC<TextWithNewLinesProps> = ({ text, className }) => {
	if (typeof text !== 'string') {
		return null;
	}

	// Replace new lines and literal new lines (description and abstract are encoded differently)
	return (
		<Html
			className={className}
			content={text.replaceAll('\\n', '<br/>').replaceAll('\n', '<br/>')}
		/>
	);
};

export default TextWithNewLines;
