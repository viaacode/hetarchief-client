import getConfig from 'next/config';
import Head from 'next/head';
import { FC } from 'react';

import { RouteKey, ROUTES_BY_LOCALE } from '@shared/const';
import { useGetAllLanguages } from '@shared/hooks/use-get-all-languages/use-get-all-languages';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { LanguageInfo } from '@shared/services/translation-service/translation.types';
import { createPageTitle, Locale } from '@shared/utils';

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
	translatedPages = [],
}) => {
	const resolvedTitle = createPageTitle(title);
	const locale = useLocale();
	const { data: languages } = useGetAllLanguages();
	const otherLanguages = (languages || []).filter((lang) => lang.languageCode !== locale);

	const getResolvedUrl = (url: string): string => {
		if (!url) {
			return publicRuntimeConfig.CLIENT_URL;
		} else if (url.startsWith('http')) {
			// Absolute url
			return url;
		} else {
			// relative url
			return publicRuntimeConfig.CLIENT_URL + '/' + locale + (url || '');
		}
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
					url: '/' + lang.languageCode + ROUTES_BY_LOCALE[lang.languageCode][routeKey],
					languageCode: lang.languageCode,
				};
			});
		}

		console.warn('No translated pages were passed for route: ' + relativeUrl);
		return [];
	};

	const url = getResolvedUrl(relativeUrl);
	return (
		<Head>
			<title>{resolvedTitle}</title>
			{description && <meta name="description" content={description} />}
			<meta property="og:type" content="website" />
			<meta property="og:url" content={url} />
			<meta property="og:title" content={resolvedTitle} />
			{description && <meta property="og:description" content={description} />}
			{imgUrl ? (
				<meta property="og:image" content={imgUrl} />
			) : (
				<meta
					property="og:image"
					content={`${publicRuntimeConfig.CLIENT_URL}/images/og.jpg`}
				/>
			)}
			<meta property="twitter:card" content="summary_large_image" />
			<meta property="twitter:domain" content={publicRuntimeConfig.CLIENT_URL} />
			<meta property="twitter:title" content={resolvedTitle} />
			{description && <meta property="twitter:description" content={description} />}
			{getTranslatedPages().map((translatedPage) => {
				return (
					<link
						key={'translated-page__' + translatedPage.languageCode}
						rel="alternate"
						hrefLang={translatedPage.languageCode}
						href={translatedPage.url}
					/>
				);
			})}
		</Head>
	);
};
