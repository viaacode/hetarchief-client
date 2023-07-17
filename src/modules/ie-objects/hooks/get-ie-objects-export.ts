import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { MetadataExportFormats } from '@ie-objects/types';
import { QUERY_KEYS } from '@shared/const';

import { IeObjectsService } from './../services';

export const useGetIeObjectsExport = (
	id: string,
	format: MetadataExportFormats,
	options: { enabled: boolean } = { enabled: true }
): UseQueryResult<string> => {
	return useQuery(
		[QUERY_KEYS.getIeObjectsExport, id, format],
		() => IeObjectsService.getExport(id, format),
		options
	);
};
