import getConfig from 'next/config';
import Head from 'next/head';
import type { FC } from 'react';

import { ROUTES_BY_LOCALE, ROUTE_PARTS_BY_LOCALE, type RouteKey } from '@shared/const';
import { useGetAllLanguages } from '@shared/hooks/use-get-all-languages/use-get-all-languages';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import type { LanguageInfo } from '@shared/services/translation-service/translation.types';
import { Locale } from '@shared/utils/i18n';
import { createPageTitle } from '@shared/utils/seo';
import { truncate } from 'lodash-es';
import { stripHtml } from 'string-strip-html';

const { publicRuntimeConfig } = getConfig();

export interface PageInfo {
	url: string;
	languageCode: Locale;
}

interface SeoTagsProps {
	title: string | null | undefined;
	description: string | null | undefined;
	relativeUrl: string;
	imgUrl: string | null | undefined;
	canonicalUrl: string | null | undefined;
	translatedPages: PageInfo[];
}

/**
 * Renders Open Graph tags for the page
 * @param title
 * @param description
 * @param url
 * @param imgUrl
 * @param translatedPages list of translated page urls with their locale
 */
export const SeoTags: FC<SeoTagsProps> = ({
	title,
	description,
	relativeUrl,
	imgUrl = null,
	canonicalUrl = null,
	translatedPages = [],
}) => {
	const resolvedTitle = createPageTitle(title);
	// https://meemoo.atlassian.net/browse/ARC-2393
	const resolvedDescription = description
		? truncate(stripHtml(description).result, { omission: '', length: 120 })
		: null;
	const locale = useLocale();
	const { data: languages } = useGetAllLanguages();
	const otherLanguages = (languages || []).filter((lang) => lang.languageCode !== locale);

	const getResolvedUrl = (url: string): string => {
		if (!url) {
			return publicRuntimeConfig.CLIENT_URL;
		}
		if (url.startsWith('http')) {
			// Absolute url
			return url;
		}
		// relative url
		return `${publicRuntimeConfig.CLIENT_URL}/${locale}${url || ''}`;
	};

	const getTranslatedPages = (): PageInfo[] => {
		if (translatedPages.length > 0) {
			return translatedPages.filter((page) => page.languageCode !== locale);
		}

		// search for page in known routes
		const knownRoutePair = Object.entries(ROUTES_BY_LOCALE[locale]).find(
			(pair) => pair[1] === relativeUrl
		);

		const routeKey = knownRoutePair?.[0] as RouteKey | undefined;
		if (routeKey) {
			// Output routes for other languages
			return otherLanguages.map((lang: LanguageInfo): PageInfo => {
				return {
					url: `/${lang.languageCode}${ROUTES_BY_LOCALE[lang.languageCode][routeKey]}`,
					languageCode: lang.languageCode,
				};
			});
		}

		// No known route was found and no translatedPages were passed
		// This can be because Next.js also renders the Dutch paths for the english locale
		// We'll check that here
		// if that isn't the case either, we should output a warning to notify the developer that he forgot something
		const knownRoutePairForOtherLocale = Object.entries(
			ROUTES_BY_LOCALE[locale === Locale.nl ? Locale.en : Locale.nl]
		).find((pair) => pair[1] === relativeUrl);
		if (knownRoutePairForOtherLocale) {
			// This is just Next.js rendering Dutch paths with the english locale or vice versa, we can ignore this
			return [];
		}
		if (
			!relativeUrl.startsWith(`/${ROUTE_PARTS_BY_LOCALE.nl.search}/`) &&
			!relativeUrl.startsWith(`/${ROUTE_PARTS_BY_LOCALE.en.search}/`)
		) {
			console.warn(`No translated pages/routes found for route: ${relativeUrl}`);
		}
		return [];
	};

	if (!relativeUrl) {
		return null;
	}
	const url = getResolvedUrl(relativeUrl);
	return (
		<Head>
			<title>{resolvedTitle}</title>
			{resolvedDescription && <meta name="description" content={resolvedDescription} />}
			<meta property="og:type" content="website" />
			<meta property="og:url" content={url} />
			{canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
			<meta property="og:title" content={resolvedTitle} />
			{resolvedDescription && <meta property="og:description" content={resolvedDescription} />}
			<meta
				property="og:image"
				content={imgUrl || `${publicRuntimeConfig.CLIENT_URL}/images/og.jpg`}
			/>
			<meta property="twitter:card" content="summary_large_image" />
			<meta property="twitter:domain" content={publicRuntimeConfig.CLIENT_URL} />
			<meta property="twitter:title" content={resolvedTitle} />
			{resolvedDescription && <meta property="twitter:description" content={resolvedDescription} />}
			{getTranslatedPages().map((translatedPage) => {
				return (
					<link
						key={`translated-page__${translatedPage.languageCode}`}
						rel="alternate"
						hrefLang={translatedPage.languageCode}
						href={translatedPage.url}
					/>
				);
			})}
		</Head>
	);
};
