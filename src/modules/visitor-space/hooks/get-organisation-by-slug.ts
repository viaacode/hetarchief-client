import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const/query-keys';
import { OrganisationService } from '@shared/services/organisation-service/organisation.service';
import { Organisation } from '@shared/services/organisation-service/organisation.types';

export function useGetOrganisationBySlug(
	slug: string | null,
	ignoreAuthError = false,
	options: { enabled: boolean } = { enabled: true }
): UseQueryResult<Organisation | null> {
	return useQuery(
		[QUERY_KEYS.getIeObjectsInfo, slug],
		() => OrganisationService.getBySlug(slug as string, ignoreAuthError),
		options
	);
}
