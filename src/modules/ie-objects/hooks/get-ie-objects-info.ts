import { type QueryClient, useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { QUERY_KEYS } from '@shared/const/query-keys';

import { type IeObject } from './../ie-objects.types';
import { IeObjectsService } from './../services';

export async function getIeObjectInfo(id: string): Promise<IeObject | null> {
	return IeObjectsService.getById(id);
}

export const useGetIeObjectInfo = (
	id: string,
	options: {
		keepPreviousData?: boolean;
		enabled?: boolean;
	} = {}
): UseQueryResult<IeObject | null> => {
	const router = useRouter();
	return useQuery(
		[QUERY_KEYS.getIeObjectsInfo, id],
		async () => {
			let newId;
			if (id.length > 36) {
				const v3Identifier = await IeObjectsService.schemaIdentifierLookup(id);
				newId = v3Identifier.schemaIdentifierV3;
				const url = new URL(window.location.href);
				url.pathname = url.pathname.replace(id, newId);
				await router.replace(url.toString());
			} else {
				newId = id;
			}
			return getIeObjectInfo(newId);
		},
		{
			keepPreviousData: true,
			enabled: true,
			...options,
		}
	);
};

export function makeServerSideRequestGetIeObjectInfo(
	queryClient: QueryClient,
	id: string
): Promise<void> {
	return queryClient.prefetchQuery({
		queryKey: [QUERY_KEYS.getIeObjectsInfo, id],
		queryFn: () => getIeObjectInfo(id),
	});
}
