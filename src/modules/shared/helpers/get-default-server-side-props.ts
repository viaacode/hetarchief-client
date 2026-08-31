import { getTranslations } from '@i18n/helpers/get-translations';
import { IeObjectsService } from '@ie-objects/services';
import type { IeObjectSeo } from '@ie-objects/services/ie-objects/ie-objects.service.types';
import { getIeObjectDetailUrl } from '@shared/helpers/ie-object-urls';
import { makeServerSideRequestGetAllLanguages } from '@shared/hooks/use-get-all-languages/use-get-all-languages';
import type { DefaultSeoInfo, PageInfo } from '@shared/types/seo';
import { Locale } from '@shared/utils/i18n';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import type { GetServerSidePropsContext, GetStaticPropsResult } from 'next/types';
import { i18n } from 'next-i18next/pages';

export async function getDefaultStaticProps(
	context: GetServerSidePropsContext,
	url: string,
	options?: {
		queryClient?: QueryClient | undefined;
		schemaIdentifier?: string;
		title?: string | null;
		description?: string | null;
		image?: string | null;
		canonicalUrl?: string | null;
		translatedPages?: PageInfo[];
		/**
		 * When provided, skips the SEO endpoint fetch and uses this value to build
		 * the canonical URL. Pass from callers that already fetched SEO themselves
		 * to avoid a duplicate blocking request.
		 */
		maintainerSlug?: string | null;
	}
): Promise<GetStaticPropsResult<DefaultSeoInfo>> {
	const locale = (context.locale || Locale.nl) as Locale;

	//Fetch translations for server side rendering
	const translations = await getTranslations(locale);
	i18n?.addResources(locale, 'common', translations);

	// Always add languages, since it is required for seo translated pages on almost all routes
	const queryClient = options?.queryClient || new QueryClient();
	await makeServerSideRequestGetAllLanguages(queryClient);
	const dehydratedState = dehydrate(queryClient);

	// If schemaIdentifier is provided, we can prefetch some seo ie-object info
	if (options?.schemaIdentifier && !options?.schemaIdentifier?.includes('/')) {
		let maintainerSlug: string | null | undefined;

		if (options?.maintainerSlug) {
			// Caller already fetched SEO data; skip the duplicate API call
			options.title = options.title || 'Het Archief';
			maintainerSlug = options.maintainerSlug;
		} else {
			let seoInfo: IeObjectSeo | null = null;
			try {
				seoInfo = await IeObjectsService.getSeoBySchemaIdentifier(options?.schemaIdentifier);
			} catch (err) {
				console.error(`Failed to fetch media seo info by id: ${context.query.ie}`, err);
			}

			options.title = options.title || seoInfo?.name || 'Het Archief';
			options.description = options.description || seoInfo?.description || null;
			options.image = options.image || seoInfo?.thumbnailUrl || null;
			maintainerSlug = seoInfo?.maintainerSlug;
		}

		if (maintainerSlug && options.schemaIdentifier && options.title) {
			// Every locale self references its own url as the canonical one, the locales are tied
			// together with hreflang tags instead. Canonicalising all locales onto the Dutch url
			// would keep the English pages out of the index entirely.
			options.canonicalUrl =
				options.canonicalUrl ||
				getIeObjectDetailUrl(locale, maintainerSlug, options.schemaIdentifier, options.title);

			options.translatedPages = options.translatedPages || [
				...Object.values(Locale).map(
					(languageCode): PageInfo => ({
						languageCode,
						url: getIeObjectDetailUrl(
							languageCode,
							maintainerSlug as string,
							options.schemaIdentifier as string,
							options.title as string
						),
					})
				),
			];
		}
	}

	return {
		props: {
			url,
			locale,
			title: options?.title || null,
			description: options?.description || null,
			image: options?.image || null,
			canonicalUrl: options?.canonicalUrl || null,
			translatedPages: options?.translatedPages || [],
			...(dehydratedState ? { dehydratedState } : {}),
			_nextI18Next: {
				initialI18nStore: {
					[locale]: {
						common: translations,
					},
				},
				initialLocale: locale,
				ns: ['common'],
			},
		},
	};
}
