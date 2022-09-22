import clsx from 'clsx';
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
			// Avoid module scss file, since next serverside rendering can't add a style block to the document.
			className={clsx('c-html-wrapper', className)}
		/>
	);
};

export default Html;
