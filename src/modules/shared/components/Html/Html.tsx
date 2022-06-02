import clsx from 'clsx';
import DOMPurify from 'dompurify';
import React, { FunctionComponent } from 'react';

import { RICH_TEXT_SANITIZATION } from '@shared/const';

import styles from './Html.module.scss';

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
			className={clsx(styles['c-html-wrapper'], className)}
		/>
	);
};

export default Html;
