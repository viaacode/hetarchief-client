import { useQuery, UseQueryResult } from 'react-query';
import { useDispatch } from 'react-redux';

import { collectionsService } from '@account/services/collections';
import { GetCollectionsResponse } from '@account/types';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { setCollections } from '@shared/store/media';

export function useGetCollections(enabled = true): UseQueryResult<GetCollectionsResponse> {
	const dispatch = useDispatch();

	return useQuery(
		[QUERY_KEYS.getCollections],
		() =>
			collectionsService.getAll().then((res) => {
				dispatch(setCollections(res));
				return res;
			}),
		{ enabled }
	);
}
