import { QUERY_KEYS } from '@shared/const/query-keys';
import { OrganisationService } from '@shared/services/organisation-service/organisation.service';
import type {
	GetOrganisationsProps,
	OrganisationListItem,
} from '@shared/services/organisation-service/organisation.types';
import type { IPagination } from '@studiohyperdrive/pagination';
import { keepPreviousData, type UseQueryResult, useQuery } from '@tanstack/react-query';

export const useGetOrganisations = (
	props: GetOrganisationsProps,
	enabled: boolean = true
): UseQueryResult<IPagination<OrganisationListItem>> =>
	useQuery({
		queryKey: [QUERY_KEYS.getOrganisations, props],
		queryFn: () => OrganisationService.getAll(props),
		placeholderData: keepPreviousData,
		enabled,
	});
