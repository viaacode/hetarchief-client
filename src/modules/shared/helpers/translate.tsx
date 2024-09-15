import { type TOptions } from 'i18next';
import { i18n } from 'next-i18next';
import React, { type ReactNode } from 'react';

import Html from '@shared/components/Html/Html';

/**
 * Wrapper around tText() that renders the translated text as html
 * @param key
 * @param params
 */
export function tHtml(key: string, params?: TOptions): ReactNode | string {
	const translatedValue: string = tText(key, {
		...params,
		defaultValue: (key.split('___')[1] || key).replace('-', ' ') + ' ***',
	});

	return <Html content={translatedValue} />;
}

/**
 * Wrapper around tText() that simply returns the translated text as a string
 * @param key
 * @param params
 */
export function tText(key: string, params?: TOptions): string {
	return (
		i18n?.t(key, {
			...params,
			defaultValue: (key.split('___')[1] || key).replace('-', ' ') + ' ***',
		}) || ''
	);
}
