import Html from '@shared/components/Html/Html';
import type { TOptions } from 'i18next';
import { i18n } from 'next-i18next/pages';
import React, { type ReactNode } from 'react';

/**
 * Wrapper around tText() that renders the translated text as html
 * @param key
 * @param params
 */
export function tHtml(key: string, params?: object): ReactNode | string {
	const translatedValue: string = tText(
		/* IGNORE_ADMIN_CORE_TRANSLATIONS_EXTRACTION */
		key,
		params
	);

	return <Html content={translatedValue} type="span" />;
}

/**
 * Wrapper around tText() that simply returns the translated text as a string
 * @param key
 * @param params
 */
export function tText(key: string, params?: object): string {
	return (
		i18n?.t(key, {
			...params,
			defaultValue: `${(key.split('___')[1] || key).replace('-', ' ')} ***`,
		} as TOptions) || ''
	);
}
