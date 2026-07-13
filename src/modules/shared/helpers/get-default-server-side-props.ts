import { getTranslations } from '@i18n/helpers/get-translations';
import { IeObjectsService } from '@ie-objects/services';
import type { IeObjectSeo } from '@ie-objects/services/ie-objects/ie-objects.service.types';
import getConfig from '@shared/config/public-runtime-config';
import { ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { makeServerSideRequestGetAllLanguages } from '@shared/hooks/use-get-all-languages/use-get-all-languages';
import type { DefaultSeoInfo } from '@shared/types/seo';
import { Locale } from '@shared/utils/i18n';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { kebabCase } from 'es-toolkit/compat';
import type { GetServerSidePropsContext, GetStaticPropsResult } from 'next/types';
import { i18n } from 'next-i18next/pages';

const { publicRuntimeConfig } = getConfig();

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

		const baseUrl = publicRuntimeConfig.CLIENT_URL;
		if (baseUrl && maintainerSlug && options.schemaIdentifier && options.title) {
			options.canonicalUrl =
				options.canonicalUrl ||
				`${baseUrl}/${ROUTE_PARTS_BY_LOCALE.nl.search}/${maintainerSlug}/${options.schemaIdentifier}/${kebabCase(
					options.title
				)}`;
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
