import { QUERY_KEYS } from '@shared/const/query-keys';
import type { IPagination } from '@studiohyperdrive/pagination';
import { keepPreviousData, type UseQueryResult, useQuery } from '@tanstack/react-query';

import { MaterialRequestsService } from '../services';
import type { MaterialRequestAttachment } from '../types';

export const useGetMaterialRequestAttachments = (
	materialRequestId: string,
	orderProp?: string,
	orderDirection?: string,
	page?: number,
	size?: number,
	enabled: boolean = true
): UseQueryResult<IPagination<MaterialRequestAttachment>> =>
	useQuery({
		queryKey: [
			QUERY_KEYS.getMaterialRequestAttachments,
			materialRequestId,
			orderProp,
			orderDirection,
			page,
			size,
		],
		queryFn: () =>
			MaterialRequestsService.getAttachments(
				materialRequestId,
				orderProp,
				orderDirection,
				page,
				size
			),
		placeholderData: keepPreviousData,
		enabled,
		retry: false,
		refetchOnMount: 'always', // Refetching this on mount to make sure to have the latest
	});
