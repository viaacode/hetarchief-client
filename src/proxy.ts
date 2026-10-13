import { getIeObjectDetailRedirectDestination } from '@shared/helpers/ie-object-urls';
import { Locale } from '@shared/utils/i18n';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * The locale (nl/en) is already stripped from the pathname by Next.js, fr and de are not
 * Captures: 1: locale, 2: media mosa id (the optional page number after it is ignored)
 * The id has to contain a letter, so a page number is never mistaken for it
 */
export const MEDIA_MOSA_ID_PATH_REGEX =
	/^(?:\/(fr|nl|de|en))?(?:\/iframe)?\/media\/(?:[^/]+\/)?([a-zA-Z0-9]*[a-zA-Z][a-zA-Z0-9]*)(?:\/[0-9]+)?\/?$/;

interface IeObjectRedirectInfo {
	schema_identifier: string;
	maintainerSlug: string;
	title: string;
}

export async function proxy(request: NextRequest) {
	try {
		const pathName = request.nextUrl.pathname;
		console.log('middleware triggered for URL: ', request.url);
		if (pathName.includes('/zoeken') || pathName.includes('/search')) {
			const headers: Record<string, string> = {};
			request.headers.forEach((value, key) => {
				if (key !== 'cookie') {
					headers[key] = value;
				}
			});
			// console.log('request headers: ', headers);
		}

		// https://meemoo.atlassian.net/browse/ARC-3185
		if (pathName === '/sitemap.xml.gz') {
			return new NextResponse('Not found', { status: 404 });
		}

		// Handle media mosa ids (old NieuwsVanDeGroteOorlog urls) and redirect them to the equivalent ie-object page
		// All variants are handled here, instead of in next.config.js redirects, so they reach the
		// canonical url in a single permanent redirect: search engines flag redirect chains
		// eg: /media/:id, /en/media/:id, /fr/media/:title/:id/:pageNumber, /de/iframe/media/:title/:id
		const mediaMosaIdMatch = pathName.match(MEDIA_MOSA_ID_PATH_REGEX);
		if (mediaMosaIdMatch) {
			const [, pathLocale, mediaMosaId] = mediaMosaIdMatch;
			const ieObjectRedirectInfo: IeObjectRedirectInfo = (await (
				await fetch(`${process.env.PROXY_URL}/ie-objects/lookup/nvdgo/${mediaMosaId}`)
			).json()) as IeObjectRedirectInfo;
			const schemaIdentifier = ieObjectRedirectInfo.schema_identifier;
			if (!schemaIdentifier || !ieObjectRedirectInfo.maintainerSlug) {
				console.error(
					'Fetching the schemaIdentifier for the nvdgo id failed: ',
					ieObjectRedirectInfo
				);
				return NextResponse.rewrite(new URL('/__force-404', request.url));
			}
			// fr and de are no longer supported, those go to the default locale
			const locale =
				request.nextUrl.locale === Locale.en || pathLocale === Locale.en ? Locale.en : Locale.nl;

			return NextResponse.redirect(
				new URL(
					getIeObjectDetailRedirectDestination(
						locale,
						ieObjectRedirectInfo.maintainerSlug,
						schemaIdentifier,
						ieObjectRedirectInfo.title
					),
					request.url
				),
				308
			);
		}

		// Other routes are not handled by this middleware
		return NextResponse.next();
	} catch (err) {
		console.error('Error in middleware: ', err);
		return NextResponse.rewrite(new URL('/__force-404', request.url));
	}
}

export const config = {
	matcher: [
		'/media/:path*',
		'/:locale/media/:path*',
		'/iframe/media/:path*',
		'/:locale/iframe/media/:path*',
		'/sitemap.xml.gz',
		'/zoeken',
		'/zoeken/:path*',
		'/search',
		'/search/:path*',
		'/nl/zoeken',
		'/nl/zoeken/:path*',
		'/en/search',
		'/en/search/:path*',
	],
};
