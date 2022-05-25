import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { ContentPartnerResponse } from '@admin/types';
import { QUERY_KEYS } from '@shared/const';

import { ContentPartnersService } from '../services/content-partners';

export function useGetContentPartners(
	hasSpace?: boolean,
	enabled = true
): UseQueryResult<ContentPartnerResponse> {
	return useQuery(
		[QUERY_KEYS.getContentPartners, { hasSpace }],
		() => ContentPartnersService.getAll(hasSpace),
		{
			keepPreviousData: true,
			enabled,
		}
	);
}
