import { QueryClient } from '@tanstack/react-query';

import { makeServerSideRequestGetIeObjectInfo } from '@ie-objects/hooks/get-ie-objects-info';
import { makeServerSideRequestGetIeObjectsRelated } from '@ie-objects/hooks/get-ie-objects-related';
import { makeServerSideRequestGetIeObjectsSimilar } from '@ie-objects/hooks/get-ie-objects-similar';
import { makeServerSideRequestGetActiveVisitForUserAndSpace } from '@visit-requests/hooks/get-active-visit-for-user-and-space';
import { makeServerSideRequestGetVisitorSpace } from '@visitor-space/hooks/get-visitor-space';

export async function prefetchDetailPageQueries(
	ieObjectId: string,
	meemooIdentifier: string | undefined,
	maintainerId: string | undefined,
	maintainerSlug: string | undefined
): Promise<QueryClient> {
	const queryClient = new QueryClient();
	await Promise.all([
		makeServerSideRequestGetIeObjectInfo(queryClient, ieObjectId),
		makeServerSideRequestGetIeObjectsRelated(
			queryClient,
			ieObjectId,
			maintainerId,
			meemooIdentifier
		),
		...(maintainerSlug
			? [
					makeServerSideRequestGetIeObjectsSimilar(queryClient, ieObjectId, maintainerId),
					makeServerSideRequestGetActiveVisitForUserAndSpace(queryClient, maintainerSlug),
					makeServerSideRequestGetVisitorSpace(queryClient, maintainerSlug, false),
			  ]
			: []),
	]);
	return queryClient;
}
