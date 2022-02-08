import ky from 'ky-universal';
import * as queryString from 'query-string';
import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { ApiResponseWrapper, ReadingRoomInfo } from '@reading-room/types';

import { QUERY_KEYS } from 'constants/query-keys';

async function getReadingRooms(searchInput?: string): Promise<ApiResponseWrapper<ReadingRoomInfo>> {
	const parsed = await ky
		.get(
			'http://localhost:3100/spaces?' +
				queryString.stringify({
					query: `%${searchInput || ''}%`,
					page: 0,
					size: 20,
				})
		)
		.json();
	return parsed as ApiResponseWrapper<ReadingRoomInfo>;
}

export function useGetReadingRooms(
	searchInput: string | undefined,
	page: number,
	size: number
): UseQueryResult<ApiResponseWrapper<ReadingRoomInfo>> {
	return useQuery([QUERY_KEYS.getReadingRooms, { searchInput, page, size }], () =>
		getReadingRooms(searchInput)
	);
}
