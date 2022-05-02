import { TOptions } from 'i18next';
import { i18n as i18next } from 'next-i18next';

export const i18n = {
	t: (key: string, variables?: TOptions | string | undefined): string => {
		const translation: string | null | undefined = i18next?.t(key, variables);
		if (!translation || translation === key) {
			return key.split('___')[1].replace('-', ' ') + ' ***';
		}
		return translation;
	},
};
