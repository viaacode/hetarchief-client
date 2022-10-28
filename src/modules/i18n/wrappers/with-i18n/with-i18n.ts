import {
	GetServerSideProps,
	GetServerSidePropsContext,
	GetStaticProps,
	GetStaticPropsContext,
} from 'next';

import { getTranslations } from '@i18n/helpers/get-translations';

import type { WithI18n } from './with-i18n.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withI18n = (gssp?: GetServerSideProps<WithI18n> | GetStaticProps<WithI18n>): any => {
	return async (context: GetServerSidePropsContext | GetStaticPropsContext) => {
		const ssrTranslations = await getTranslations();
		const propsWithI18n = { props: { ...ssrTranslations } };

		if (!gssp) {
			return propsWithI18n;
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const props = await gssp(context as any);

		return {
			props: {
				...props,
				...propsWithI18n.props,
			},
		};
	};
};
