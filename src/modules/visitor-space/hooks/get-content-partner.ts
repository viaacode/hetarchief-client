import { type ContentPartnerParams, ContentPartnersService } from '@cp/services/content-partners';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { useQuery } from '@tanstack/react-query';

export interface MaintainerInfo {
	id: string;
	name: string;
}

export function useGetContentPartners(
	params: ContentPartnerParams,
	options: { enabled?: boolean } = {}
) {
	return useQuery({
		queryKey: [QUERY_KEYS.getContentPartners, params],
		queryFn: async () => {
			const response = await ContentPartnersService.getAll(params);
			return response?.items ?? [];
		},
		enabled: true,
		...options,
	});
}
