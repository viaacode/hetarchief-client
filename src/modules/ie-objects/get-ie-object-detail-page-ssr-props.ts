import { MIN_LENGTH_SCHEMA_IDENTIFIER_V2 } from '@ie-objects/ie-objects.consts';
import type { IeObject } from '@ie-objects/ie-objects.types';
import { prefetchDetailPageQueries } from '@ie-objects/ObjectDetailPage.helpers';
import { IeObjectsService } from '@ie-objects/services';
import type { IeObjectSeo } from '@ie-objects/services/ie-objects/ie-objects.service.types';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import {
	getIeObjectDetailPath,
	getIeObjectDetailRedirectDestination,
} from '@shared/helpers/ie-object-urls';
import type { DefaultSeoInfo } from '@shared/types/seo';
import { Locale } from '@shared/utils/i18n';
import type { GetServerSidePropsResult } from 'next';
import type { GetServerSidePropsContext } from 'next/types';

/** Splits '/zoeken/vrt/abc/title?zoomLevel=1' into ['/zoeken/vrt/abc/title', '?zoomLevel=1'] */
function splitPathAndQuery(resolvedUrl: string): [string, string] {
	const queryStart = resolvedUrl.indexOf('?');
	if (queryStart === -1) {
		return [resolvedUrl, ''];
	}
	return [resolvedUrl.slice(0, queryStart), resolvedUrl.slice(queryStart)];
}

/** Decoded version of the requested path, so it can be compared to a freshly built path */
function decodePath(path: string): string {
	try {
		return decodeURIComponent(path);
	} catch {
		// Malformed percent encoding, compare against the raw value instead
		return path;
	}
}

/**
 * Shared getServerSideProps for both locale variants of the ie-object detail page:
 *   /zoeken/:maintainerSlug/:ieObjectId/:ieObjectName   (nl)
 *   /search/:maintainerSlug/:ieObjectId/:ieObjectName   (en)
 *
 * An ie-object is reachable through many url variants: the name part is not validated, the
 * maintainer slug can be outdated and old (v2) ids still circulate. Serving a 200 for all of
 * them creates an unbounded amount of duplicate urls, so anything that is not the canonical
 * url is permanently redirected to it.
 * https://meemoo.atlassian.net/browse/ARC-3363
 */
export async function getIeObjectDetailPageServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	const locale = (context.locale || Locale.nl) as Locale;
	const schemaIdentifier = context.query.ie as string;
	let newSchemaIdentifier = schemaIdentifier;

	let ieObject: IeObject | null = null;
	let showHard404IfNotFound = true;
	try {
		if (schemaIdentifier.length > MIN_LENGTH_SCHEMA_IDENTIFIER_V2) {
			// This is an old schema identifier (v2), we need to convert it to a new one (v3)
			const v3IdentifierResponse = await IeObjectsService.lookupV2Id(schemaIdentifier);
			newSchemaIdentifier = v3IdentifierResponse.schemaIdentifierV3;
		}

		ieObject = (await IeObjectsService.getBySchemaIdentifiers([newSchemaIdentifier], true))?.[0];
		// biome-ignore lint/suspicious/noExplicitAny: we just do not know
	} catch (err: any) {
		if (err?.response?.status === 403) {
			// https://meemoo.atlassian.net/browse/ARC-3299
			// Do not throw a hard 404 when the object is not publicly accessible, since users still want to visit that page
			showHard404IfNotFound = false;
		}
	}

	if (!ieObject && showHard404IfNotFound) {
		return { notFound: true };
	}

	let seoInfo: IeObjectSeo | null = null;
	try {
		seoInfo = await IeObjectsService.getSeoBySchemaIdentifier(newSchemaIdentifier);
	} catch (err) {
		console.error(`Failed to fetch media info by id: ${context.query.ie}`, err);
	}

	const maintainerSlug = seoInfo?.maintainerSlug ?? ieObject?.maintainerSlug ?? null;
	const title = seoInfo?.name ?? ieObject?.name ?? null;

	// Redirect every non canonical url variant to the canonical one, keeping the query params
	// (eg the iiif viewer zoom level) intact. Only possible when we know the object, so private
	// objects (403) simply render on whatever url was requested.
	if (maintainerSlug && title) {
		const [requestedPath, queryString] = splitPathAndQuery(context.resolvedUrl);
		const canonicalPath = getIeObjectDetailPath(locale, maintainerSlug, newSchemaIdentifier, title);

		if (decodePath(requestedPath) !== canonicalPath) {
			return {
				redirect: {
					// Next.js uses the destination verbatim, so the locale prefix has to be included
					destination: `${getIeObjectDetailRedirectDestination(
						locale,
						maintainerSlug,
						newSchemaIdentifier,
						title
					)}${queryString}`,
					permanent: true,
				},
			};
		}
	}

	return getDefaultStaticProps(context, context.resolvedUrl, {
		queryClient: await prefetchDetailPageQueries(
			schemaIdentifier,
			(context.query.slug as string) || null,
			ieObject ?? null
		),
		schemaIdentifier: newSchemaIdentifier,
		title: seoInfo?.name,
		description: seoInfo?.description,
		image: seoInfo?.thumbnailUrl,
		maintainerSlug,
	});
}
