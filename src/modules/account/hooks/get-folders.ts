import { IPagination } from '@studiohyperdrive/pagination';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { foldersService } from '@account/services/folders';
import { Folder } from '@account/types';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { setFolders } from '@shared/store/ie-objects';

export function useGetFolders(enabled = true): UseQueryResult<IPagination<Folder>> {
	const dispatch = useDispatch();

	return useQuery<IPagination<Folder>>(
		[QUERY_KEYS.getCollections],
		() =>
			foldersService.getAll().then((res) => {
				dispatch(setFolders(res.items));
				return res || [];
			}),
		{ enabled }
	);
}
