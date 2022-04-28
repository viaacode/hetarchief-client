import DOMPurify from 'dompurify';
import { ReactNode } from 'react';

import { RICH_TEXT_SANITIZATION } from '@shared/const';

export function renderWithNewLines(text: string | null | undefined, className?: string): ReactNode {
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
						text.replaceAll('\\n', '<br/><br/>').replaceAll('\n', '<br/><br/>'),
						RICH_TEXT_SANITIZATION
					)
				),
			}}
		/>
	);
}
