import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { foldersService } from '@account/services/folders';
import { Folder } from '@account/types';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { setFolders } from '@shared/store/ie-objects';

export function useGetFolders(enabled = true): UseQueryResult<Folder[]> {
	const dispatch = useDispatch();

	return useQuery(
		[QUERY_KEYS.getCollections],
		() =>
			foldersService.getAll().then((res) => {
				dispatch(setFolders(res.items));
				return res;
			}),
		{ enabled }
	);
}
