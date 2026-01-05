import { QUERY_KEYS } from '@shared/const/query-keys';
import { OrganisationService } from '@shared/services/organisation-service/organisation.service';
import type { Organisation } from '@shared/services/organisation-service/organisation.types';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';

export function useGetOrganisationBySlug(
	slug: string | null,
	ignoreAuthError = false,
	options: { enabled: boolean } = { enabled: true }
): UseQueryResult<Organisation | null> {
	return useQuery({
		queryKey: [QUERY_KEYS.getIeObjectsInfo, slug],
		queryFn: () => OrganisationService.getBySlug(slug as string, ignoreAuthError),
		...options,
	});
}
