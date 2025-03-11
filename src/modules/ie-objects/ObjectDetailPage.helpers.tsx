import { QueryClient } from '@tanstack/react-query';

import { makeServerSideRequestGetIeObjectInfo } from '@ie-objects/hooks/get-ie-objects-info';
import { makeServerSideRequestGetIeObjectsRelated } from '@ie-objects/hooks/get-ie-objects-related';
import { makeServerSideRequestGetIeObjectsSimilar } from '@ie-objects/hooks/get-ie-objects-similar';
import { makeServerSideRequestGetActiveVisitRequestForUserAndSpace } from '@visit-requests/hooks/get-active-visit-request-for-user-and-space';
import { makeServerSideRequestGetVisitorSpace } from '@visitor-space/hooks/get-visitor-space';

export async function prefetchDetailPageQueries(
	schemaIdentifier: string,
	maintainerId: string | undefined,
	maintainerSlug: string | undefined
): Promise<QueryClient> {
	if (schemaIdentifier) {
		return new QueryClient();
	}
	const queryClient = new QueryClient();
	const promises = [];
	promises.push(
		makeServerSideRequestGetIeObjectInfo(queryClient, schemaIdentifier),
		makeServerSideRequestGetIeObjectsRelated(
			queryClient,
			schemaIdentifier,
			schemaIdentifier, // TODO replace with new query to find related objects using the 'is part of' relationship
			maintainerId
		)
	);
	if (maintainerSlug) {
		promises.push(
			makeServerSideRequestGetIeObjectsSimilar(queryClient, schemaIdentifier, maintainerId),
			makeServerSideRequestGetActiveVisitRequestForUserAndSpace(queryClient, maintainerSlug),
			makeServerSideRequestGetVisitorSpace(queryClient, maintainerSlug, false)
		);
	}
	if (maintainerSlug) {
		promises.push(
			makeServerSideRequestGetIeObjectsSimilar(queryClient, schemaIdentifier, maintainerId)
		);
	}
	await Promise.all(promises);
	return queryClient;
}
