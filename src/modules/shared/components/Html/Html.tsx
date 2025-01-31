import clsx from 'clsx';
import DOMPurify from 'isomorphic-dompurify';
import React, { type FunctionComponent, type ReactNode } from 'react';

import { RICH_TEXT_SANITIZATION } from '@shared/const';

export interface HtmlProps {
	children?: ReactNode;
	content: string;
	sanitizePreset?: DOMPurify.Config;
	type?: 'p' | 'div' | 'span';
	className?: string;
}

const Html: FunctionComponent<HtmlProps> = ({
	content,
	sanitizePreset = RICH_TEXT_SANITIZATION,
	type = 'div',
	className,
}): ReactNode => {
	const Type = type;

	return (
		<Type
			// biome-ignore lint/security/noDangerouslySetInnerHtml: This component is used to render HTML content that has been sanatized
			dangerouslySetInnerHTML={{
				__html: DOMPurify.sanitize(content, sanitizePreset) as string,
			}}
			// Avoid module scss file, since next serverside rendering can't add a style block to the document.
			className={clsx('c-html-wrapper', className)}
		/>
	);
};

export default Html;
