import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { type ContentPartnerParams, ContentPartnersService } from '@cp/services/content-partners';
import { QUERY_KEYS } from '@shared/const/query-keys';

export interface MaintainerInfo {
	id: string;
	name: string;
}

export function useGetContentPartners(
	params: ContentPartnerParams,
	options: { enabled?: boolean } = {}
): UseQueryResult<MaintainerInfo[]> {
	return useQuery(
		[QUERY_KEYS.getContentPartners, params],
		async () => {
			const response = await ContentPartnersService.getAll(params);
			return response?.items ?? [];
		},
		{ enabled: true, ...options }
	);
}
