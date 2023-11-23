import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { foldersService } from '@account/services/folders';
import { GetFoldersResponse } from '@account/types';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { setFolders } from '@shared/store/ie-objects';

export function useGetFolders(enabled = true): UseQueryResult<GetFoldersResponse> {
	const dispatch = useDispatch();

	return useQuery(
		[QUERY_KEYS.getCollections],
		() =>
			foldersService.getAll().then((res) => {
				dispatch(setFolders(res));
				return res;
			}),
		{ enabled }
	);
}
