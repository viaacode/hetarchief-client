import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { FoldersService } from '@account/services/folders';
import type { Folder } from '@account/types';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { setFolders } from '@shared/store/ie-objects';

export function useGetFolders(enabled = true): UseQueryResult<Folder[]> {
	const dispatch = useDispatch();

	return useQuery<Folder[]>(
		[QUERY_KEYS.getCollections],
		async () => {
			const response = await FoldersService.getAll();
			dispatch(setFolders(response.items));
			return response.items || [];
		},
		{ enabled }
	);
}
