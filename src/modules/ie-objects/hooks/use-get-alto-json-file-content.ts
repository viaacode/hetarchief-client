import { IeObjectsService } from '@ie-objects/services';
import type { SimplifiedAltoInfo } from '@iiif-viewer/IiifViewer.types';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export const useGetAltoJsonFileContent = (
	altoJsonUrl: string | null,
	pageIndex: number,
	options: { enabled: boolean } = { enabled: true }
) => {
	return useQuery<SimplifiedAltoInfo | null>({
		queryKey: [QUERY_KEYS.getAltoJsonFileContent, altoJsonUrl, pageIndex, options],
		queryFn: async () => {
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
		placeholderData: keepPreviousData,
		...options,
	});
};
