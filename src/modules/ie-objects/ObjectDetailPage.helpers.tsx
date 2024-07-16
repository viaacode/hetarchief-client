import { QueryClient } from '@tanstack/react-query';

import { OPEN_SEA_DRAGON_POC } from '@ie-objects/ObjectDetailPage.consts';
import { makeServerSideRequestGetIeObjectInfo } from '@ie-objects/hooks/get-ie-objects-info';
import { makeServerSideRequestGetIeObjectsRelated } from '@ie-objects/hooks/get-ie-objects-related';
import { makeServerSideRequestGetIeObjectsSimilar } from '@ie-objects/hooks/get-ie-objects-similar';
import { makeServerSideRequestGetActiveVisitForUserAndSpace } from '@visit-requests/hooks/get-active-visit-for-user-and-space';
import { makeServerSideRequestGetVisitorSpace } from '@visitor-space/hooks/get-visitor-space';

export async function prefetchDetailPageQueries(
	ieObjectId: string,
	maintainerId: string | undefined,
	maintainerSlug: string | undefined
): Promise<QueryClient> {
	if (ieObjectId) {
		return new QueryClient();
	}
	const queryClient = new QueryClient();
	const promises = [];
	if (ieObjectId !== OPEN_SEA_DRAGON_POC) {
		promises.push(
			makeServerSideRequestGetIeObjectInfo(queryClient, ieObjectId),
			makeServerSideRequestGetIeObjectsRelated(
				queryClient,
				ieObjectId,
				ieObjectId, // TODO replace with new query to find related objects using the 'is part of' relationship
				maintainerId
			)
		);
	}
	if (maintainerSlug) {
		promises.push(
			makeServerSideRequestGetIeObjectsSimilar(queryClient, ieObjectId, maintainerId),
			makeServerSideRequestGetActiveVisitForUserAndSpace(queryClient, maintainerSlug),
			makeServerSideRequestGetVisitorSpace(queryClient, maintainerSlug, false)
		);
	}
	if (maintainerSlug && ieObjectId !== OPEN_SEA_DRAGON_POC) {
		promises.push(
			makeServerSideRequestGetIeObjectsSimilar(queryClient, ieObjectId, maintainerId)
		);
	}
	await Promise.all(promises);
	return queryClient;
}
