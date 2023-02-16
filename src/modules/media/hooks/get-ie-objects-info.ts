import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { MediaService } from '@media/services';
import { Media } from '@media/types';
import { QUERY_KEYS } from '@shared/const/query-keys';

export function useGetIeObjectsInfo(id: string): UseQueryResult<Media> {
	return useQuery([QUERY_KEYS.getIeObjectsInfo, { id }], () => MediaService.getById(id), {
		keepPreviousData: false,
	});
}
