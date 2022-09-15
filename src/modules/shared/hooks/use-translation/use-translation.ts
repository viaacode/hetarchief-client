import { TOptions } from 'i18next';
import { DefaultNamespace } from 'next-i18next';
import { ReactNode } from 'react';
import {
	Namespace,
	useTranslation as useI18NextTranslation,
	UseTranslationResponse,
} from 'react-i18next';

import { tHtml, tText } from '@shared/helpers/translate';

export type useTranslationsResponse<N extends Namespace = DefaultNamespace> = Omit<
	UseTranslationResponse<N>,
	't'
> & {
	tHtml: (key: string, params?: TOptions | string | undefined) => ReactNode;
	tText: (key: string, params?: TOptions | string | undefined) => string;
};

const useTranslation = (): useTranslationsResponse => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { t, ...rest } = useI18NextTranslation();
	return { tHtml, tText, ...rest };
};

export default useTranslation;
