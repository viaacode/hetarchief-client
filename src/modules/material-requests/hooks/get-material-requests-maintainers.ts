import type { MaterialRequestMaintainer } from '@material-requests/types';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { MaterialRequestsService } from '../services';

export const useGetMaterialRequestsMaintainers = () =>
	useQuery<MaterialRequestMaintainer[] | null>({
		queryKey: [QUERY_KEYS.getMaterialRequests],
		queryFn: () => MaterialRequestsService.getMaintainers(),
		placeholderData: keepPreviousData,
	});
