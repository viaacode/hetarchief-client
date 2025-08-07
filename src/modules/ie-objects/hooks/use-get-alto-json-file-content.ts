import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { IeObjectsService } from '@ie-objects/services';
import type { SimplifiedAltoInfo } from '@iiif-viewer/IiifViewer.types';
import { QUERY_KEYS } from '@shared/const/query-keys';

export const useGetAltoJsonFileContent = (
	altoJsonUrl: string | null,
	pageIndex: number,
	options: { enabled: boolean } = { enabled: true }
): UseQueryResult<SimplifiedAltoInfo> => {
	return useQuery(
		[QUERY_KEYS.getAltoJsonFileContent, altoJsonUrl, pageIndex, options],
		async () => {
			if (!altoJsonUrl) {
				return null;
			}

			const altoJsonContent = await IeObjectsService.getAltoJsonFile(altoJsonUrl);
			return {
				pageIndex,
				altoJsonUrl,
				altoJsonContent,
			};
		},
		{
			keepPreviousData: true,
			enabled: options.enabled,
		}
	);
};
