import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { DEFAULT_LOCALE } from '@shared/const/i18n';

import { WithI18n } from './with-i18n.types';

export const withI18n = (gssp?: GetServerSideProps<WithI18n>): GetServerSideProps<WithI18n> => {
	return async (context: GetServerSidePropsContext) => {
		const { locale = DEFAULT_LOCALE } = context;
		const ssrTranslations = await serverSideTranslations(locale);
		const propsWithI18n = { props: { ...ssrTranslations } };

		if (!gssp) {
			return propsWithI18n;
		}

		const props = await gssp(context);

		return {
			props: {
				...props,
				...propsWithI18n.props,
			},
		};
	};
};
