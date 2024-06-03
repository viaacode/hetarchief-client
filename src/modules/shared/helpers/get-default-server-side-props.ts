import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSidePropsContext, GetStaticPropsResult } from 'next/types';
import { i18n } from 'next-i18next';

import { getTranslations } from '@i18n/helpers/get-translations';
import { makeServerSideRequestGetAllLanguages } from '@shared/hooks/use-get-all-languages/use-get-all-languages';
import { DefaultSeoInfo } from '@shared/types/seo';
import { Locale } from '@shared/utils';

export async function getDefaultStaticProps(
	context: GetServerSidePropsContext,
	queryClient: QueryClient | undefined,
	url: string,
	title?: string | null,
	description?: string | null,
	image?: string | null
): Promise<GetStaticPropsResult<DefaultSeoInfo>> {
	const locale = (context.locale || Locale.nl) as Locale;

	//Fetch translations for server side rendering
	const translations = await getTranslations(locale);
	i18n?.addResources(locale, 'common', translations);

	// Always add languages, since it is required for seo translated pages on almost all routes
	queryClient = queryClient || new QueryClient();
	await makeServerSideRequestGetAllLanguages(queryClient);
	const dehydratedState = dehydrate(queryClient);

	return {
		props: {
			url,
			title: title || null,
			description: description || null,
			image: image || null,
			...(dehydratedState ? { dehydratedState } : {}),
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
