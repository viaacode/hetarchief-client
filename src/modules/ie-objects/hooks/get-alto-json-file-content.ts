import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { IeObjectsService } from '@ie-objects/services';
import { type SimplifiedAlto } from '@iiif-viewer/IiifViewer.types';
import { QUERY_KEYS } from '@shared/const/query-keys';

import { convertAltoXmlFileUrlToSimplifiedJson } from '../../../../scripts/altos/extract-text-lines-from-alto-internal';

export const useGetAltoJsonFileContent = (
	altoJsonUrl: string | null,
	options: { enabled: boolean } = { enabled: true }
): UseQueryResult<SimplifiedAlto> => {
	return useQuery(
		[QUERY_KEYS.getAltoJsonFileContent, altoJsonUrl, options],
		async () => {
			if (!altoJsonUrl) {
				return null;
			}

			if (altoJsonUrl.endsWith('.xml')) {
				return convertAltoXmlFileUrlToSimplifiedJson(altoJsonUrl);
			}

			return await IeObjectsService.getAltoJsonFile(altoJsonUrl);
		},
		{
			keepPreviousData: true,
			enabled: options.enabled,
		}
	);
};
