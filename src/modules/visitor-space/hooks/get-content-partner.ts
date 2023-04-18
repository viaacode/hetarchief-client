import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { ContentPartnerParams, ContentPartnersService } from '@cp/services/content-partners';
import { QUERY_KEYS } from '@shared/const/query-keys';

export interface MaintainerInfo {
	id: string;
	name: string;
}

export function useGetContentPartners(
	params: ContentPartnerParams,
	enabled = true
): UseQueryResult<MaintainerInfo[]> {
	return useQuery(
		[QUERY_KEYS.getIeObjectsInfo, params],
		async () => {
			const response = await ContentPartnersService.getAll(params);
			return response?.items ?? [];
		},
		{ enabled }
	);
}
