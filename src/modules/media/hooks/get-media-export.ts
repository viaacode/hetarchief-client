import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { MediaService } from '@media/services';
import { QUERY_KEYS } from '@shared/const/query-keys';

export function useGetMediaExport(id?: string, enabled = true): UseQueryResult<Blob | null> {
	return useQuery([QUERY_KEYS.getMediaExport, { id }], () => MediaService.getExport(id), {
		enabled,
	});
}
