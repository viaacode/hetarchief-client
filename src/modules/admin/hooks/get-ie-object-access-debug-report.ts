import type {
	IeObjectAccessDebugRequest,
	IeObjectAccessDebugResponse,
} from '@admin/views/ie-object-access/IeObjectAccessPage.types';
import { IeObjectsService } from '@ie-objects/services';
import { QUERY_KEYS } from '@shared/const';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';

export const useGetIeObjectAccessDebugReport = (
	request: IeObjectAccessDebugRequest | null
): UseQueryResult<IeObjectAccessDebugResponse> =>
	useQuery({
		queryKey: [QUERY_KEYS.getIeObjectAccessDebugReport, request],
		queryFn: () => IeObjectsService.getAccessDebugReport(request as IeObjectAccessDebugRequest),
		enabled: !!request?.schemaIdentifier,
		// Always show the current access, never a cached report
		gcTime: 0,
		retry: false,
		refetchOnWindowFocus: false,
	});
