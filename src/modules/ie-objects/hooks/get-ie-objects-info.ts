import { QueryClient, useQuery, UseQueryResult } from '@tanstack/react-query';

import { isStringOfFormatIeObjectSchemaIdentifier } from '@ie-objects/helpers/isStringOfFormatIeObjectSchemaIdentifier';
import { QUERY_KEYS } from '@shared/const/query-keys';

import { IeObjectsService } from './../services';
import { IeObject } from './../types';

function queryFn(id: string) {
	if (isStringOfFormatIeObjectSchemaIdentifier(id)) {
		// If the id doesn't have the correct format, we don't even have to try the request to the backend
		return null;
	}

	return IeObjectsService.getById(id);
}

export const useGetIeObjectsInfo = (
	id: string,
	options: {
		keepPreviousData?: boolean;
		enabled?: boolean;
	} = {}
): UseQueryResult<IeObject | null> => {
	return useQuery([QUERY_KEYS.getIeObjectsInfo, { id }], () => queryFn(id), {
		keepPreviousData: true,
		enabled: true,
		...options,
	});
};

export const prefetchGetIeObjectsInfo = (id: string, queryClient: QueryClient): Promise<void> => {
	return queryClient.prefetchQuery([QUERY_KEYS.getIeObjectsInfo, { id }], () => queryFn(id));
};
