import type { Organisation } from '@admin/views/organisations/organisations.types';
import { QUERY_KEYS } from '@shared/const/query-keys';
import type { IPagination } from '@studiohyperdrive/pagination';
import { keepPreviousData, type UseQueryResult, useQuery } from '@tanstack/react-query';

import { type GetOrganisationsProps, OrganisationsService } from '../services/organisations';

export const useGetOrganisations = (
	props: GetOrganisationsProps,
	enabled: boolean = true
): UseQueryResult<IPagination<Organisation>> =>
	useQuery({
		queryKey: [QUERY_KEYS.getOrganisations, props],
		queryFn: () => OrganisationsService.getAll(props),
		placeholderData: keepPreviousData,
		enabled,
	});
