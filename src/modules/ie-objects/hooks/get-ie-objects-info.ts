import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { isStringOfFormatIeObjectSchemaIdentifier } from '@ie-objects/helpers/isStringOfFormatIeObjectSchemaIdentifier';
import { QUERY_KEYS } from '@shared/const/query-keys';

import { IeObjectsService } from './../services';
import { IeObject } from './../types';

export async function getIeObjectInfo(id: string): Promise<IeObject | null> {
	if (!isStringOfFormatIeObjectSchemaIdentifier(id)) {
		// If the id doesn't have the correct format, we don't even have to try the request to the backend
		return null;
	}

	return IeObjectsService.getById(id);
}

export const useGetIeObjectInfo = (
	id: string,
	options: {
		keepPreviousData?: boolean;
		enabled?: boolean;
	} = {}
): UseQueryResult<IeObject | null> => {
	return useQuery([QUERY_KEYS.getIeObjectsInfo, { id }], () => getIeObjectInfo(id), {
		keepPreviousData: true,
		enabled: true,
		...options,
	});
};
