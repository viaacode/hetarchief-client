import { QUERY_KEYS } from '@shared/const/query-keys';
import { keepPreviousData, type Query, type UseQueryResult, useQuery } from '@tanstack/react-query';
import { minutesToMilliseconds } from 'date-fns';

import { MaterialRequestsService } from '../services';
import {
	type MaterialRequest,
	MaterialRequestDownloadStatus,
	MaterialRequestStatus,
} from '../types';

export const useGetMaterialRequestById = (
	id: string | null,
	enabled: boolean
): UseQueryResult<MaterialRequest | null> =>
	useQuery({
		queryKey: [QUERY_KEYS.getMaterialRequestById, id],
		queryFn: () => MaterialRequestsService.getById(id),
		placeholderData: keepPreviousData,
		enabled,
		refetchInterval: (query: Query<MaterialRequest | null>) => {
			const materialRequest = query.state.data;

			// We only want to poll if the status is approved and not failed or succeeded
			// This means that a download is in progress and we want to make sure to update the view when it would become available
			if (
				materialRequest?.status === MaterialRequestStatus.APPROVED &&
				materialRequest.downloadStatus !== MaterialRequestDownloadStatus.FAILED &&
				materialRequest.downloadStatus !== MaterialRequestDownloadStatus.SUCCEEDED
			) {
				return minutesToMilliseconds(5);
			}
			return false;
		},
	});
