import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { MediaService } from '@media/services';
import { Media } from '@media/types';
import { QUERY_KEYS } from '@shared/const/query-keys';
// import { ApiResponseWrapper } from '@shared/types/api';

export function useGetMediaInfo(id: string): UseQueryResult<Media> {
	return useQuery([QUERY_KEYS.getMediaInfo, { id }], () => MediaService.getById(id));
}
