import { setServerSideIeObjectInfo } from '@ie-objects/hooks/use-get-ie-object-by-schema-identifier';
import { makeServerSideRequestGetIeObjectsRelated } from '@ie-objects/hooks/use-get-ie-objects-related';
import { makeServerSideRequestGetIeObjectsSimilar } from '@ie-objects/hooks/use-get-ie-objects-similar';
import { makeServerSideRequestGetIeObjectThumbnail } from '@ie-objects/hooks/use-get-ie-objects-thumbnail';
import { QueryClient } from '@tanstack/react-query';
import type { HetArchiefIeObject } from '@viaa/avo2-types';
import { makeServerSideRequestGetActiveVisitRequestForUserAndSpace } from '@visit-requests/hooks/get-active-visit-request-for-user-and-space';
import { makeServerSideRequestGetVisitorSpace } from '@visitor-space/hooks/get-visitor-space';

/**
 * Fill the react-query cache with everything the detail page needs to render its metadata sidebar
 * without a single request in the browser. The dehydrated cache is sent along with the html,
 * so search engine crawlers see the full metadata of the object.
 *
 * The query keys below have to match the ones used by the hooks in the ObjectDetailPage component
 * exactly, otherwise react-query treats them as different queries and the prefetched data is ignored.
 *
 * @param urlSchemaIdentifier the ie object identifier as it appears in the url (context.query.ie).
 *        The client keys its query on this value, so this is the key we have to prefetch under.
 * @param urlMaintainerSlug the maintainer slug as it appears in the url (context.query.slug).
 *        The client keys the visitor space and visit request queries on this value.
 * @param ieObject the ie object that was already fetched in getServerSideProps, or null when the
 *        object is not publicly accessible
 */
export async function prefetchDetailPageQueries(
	urlSchemaIdentifier: string,
	urlMaintainerSlug: string | null,
	ieObject: HetArchiefIeObject | null
): Promise<QueryClient> {
	const queryClient = new QueryClient();

	if (!urlSchemaIdentifier) {
		return queryClient;
	}

	if (ieObject) {
		// Reuse the object that getServerSideProps already fetched instead of requesting it again
		setServerSideIeObjectInfo(queryClient, urlSchemaIdentifier, ieObject);
		if (ieObject.schemaIdentifier && ieObject.schemaIdentifier !== urlSchemaIdentifier) {
			// The url uses an old v2 identifier. The client redirects to the v3 identifier,
			// so seed both keys to avoid a refetch after the redirect
			setServerSideIeObjectInfo(queryClient, ieObject.schemaIdentifier, ieObject);
		}
	}

	const promises: Promise<unknown>[] = [
		makeServerSideRequestGetIeObjectThumbnail(queryClient, urlSchemaIdentifier),
	];

	if (ieObject) {
		promises.push(
			makeServerSideRequestGetIeObjectsRelated(
				queryClient,
				ieObject.iri,
				ieObject.premisIsPartOf || null
			),
			// Server side rendering is always anonymous, so the user never has access to the
			// maintainer and the client passes an empty maintainerId. Match that key here.
			makeServerSideRequestGetIeObjectsSimilar(queryClient, ieObject.schemaIdentifier, '')
		);
	}

	if (urlMaintainerSlug) {
		promises.push(
			makeServerSideRequestGetActiveVisitRequestForUserAndSpace(queryClient, urlMaintainerSlug),
			makeServerSideRequestGetVisitorSpace(queryClient, urlMaintainerSlug, false)
		);
	}

	// One failing side request (eg: a 403 on a non public object) should never take down
	// the server side render of the metadata. https://meemoo.atlassian.net/browse/ARC-3299
	await Promise.allSettled(promises);

	return queryClient;
}
