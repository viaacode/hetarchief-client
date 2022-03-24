import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { QUERY_KEYS } from '@shared/const/query-keys';

import { ReadingRoomService } from '../services';
import { ReadingRoomInfo } from '../types';

export function useGetReadingRoomInfo(id: string): UseQueryResult<ReadingRoomInfo> {
	return useQuery([QUERY_KEYS.getReadingRoomInfo, { id }], () => ReadingRoomService.getById(id));
}
