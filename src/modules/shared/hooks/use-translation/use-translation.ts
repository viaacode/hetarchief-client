import { TOptions } from 'i18next';
import { ReactNode } from 'react';

import { tHtml, tText } from '@shared/helpers/translate';

export type useTranslationsResponse = {
	tHtml: (key: string, params?: TOptions | string | undefined) => ReactNode;
	tText: (key: string, params?: TOptions | string | undefined) => string;
};

const useTranslation = (): useTranslationsResponse => {
	return { tHtml, tText };
};

export default useTranslation;
