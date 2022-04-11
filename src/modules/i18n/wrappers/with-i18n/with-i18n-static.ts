import { GetStaticProps, GetStaticPropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { DEFAULT_LOCALE } from '../../const';

import { WithI18n } from './with-i18n.types';

export const withI18nStatic = (gsp?: GetStaticProps<WithI18n>): GetStaticProps<WithI18n> => {
	return async (context: GetStaticPropsContext) => {
		const { locale = DEFAULT_LOCALE } = context;
		const ssrTranslations = await serverSideTranslations(locale);
		const propsWithI18n = { props: { ...ssrTranslations } };

		if (!gsp) {
			return propsWithI18n;
		}

		const props = await gsp(context);

		return {
			props: {
				...props,
				...propsWithI18n.props,
			},
		};
	};
};
