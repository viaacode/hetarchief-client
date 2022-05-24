import DOMPurify from 'dompurify';
import React, { FunctionComponent } from 'react';

import { RICH_TEXT_SANITIZATION } from '@shared/const';

export interface HtmlProps {
	content: string;
	sanitizePreset?: DOMPurify.Config;
	type?: 'p' | 'div' | 'span';
	className?: string;
}

const Html: FunctionComponent<HtmlProps> = ({
	content,
	sanitizePreset = RICH_TEXT_SANITIZATION,
	type = 'p',
	className,
}) => {
	const Type = type;

	return (
		<Type
			dangerouslySetInnerHTML={{
				__html: DOMPurify.sanitize(content, sanitizePreset) as string,
			}}
			className={className}
		/>
	);
};

export default Html;
