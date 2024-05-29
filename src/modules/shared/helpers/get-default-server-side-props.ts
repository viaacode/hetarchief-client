import { DehydratedState } from '@tanstack/react-query';
import getConfig from 'next/config';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next/types';
import { i18n } from 'next-i18next';

import { getTranslations } from '@i18n/helpers/get-translations';
import { DefaultSeoInfo } from '@shared/types/seo';
import { isBrowser, Locale } from '@shared/utils';

const { publicRuntimeConfig } = getConfig();

export async function getDefaultStaticProps(
	context: GetServerSidePropsContext,
	dehydratedState?: DehydratedState,
	title?: string | null,
	description?: string | null,
	image?: string | null
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	const locale = (context.locale || Locale.nl) as Locale;
	const translations = await getTranslations(locale);
	i18n?.addResources(locale, 'common', translations);
	return {
		props: {
			url:
				(isBrowser() ? publicRuntimeConfig.CLIENT_URL : process.env.CLIENT_URL) +
				(context?.resolvedUrl || ''),
			title: title || null,
			description: description || null,
			image: image || null,
			dehydratedState,
			_nextI18Next: {
				initialI18nStore: {
					[locale]: {
						common: translations,
					},
				},
			},
		},
	};
}
