import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { isEmpty, isNil } from 'lodash-es';

import { GetNewsletterPreferencesResponse } from '@account/types';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { CampaignMonitorService } from '@shared/services/campaign-monitor-service';

export const useGetNewsletterPreferences = (
	email: string | undefined
): UseQueryResult<GetNewsletterPreferencesResponse | null> => {
	return useQuery([QUERY_KEYS.getNewsletterPreferences, { email }], () => {
		if (isNil(email)) {
			return null;
		}

		if (isEmpty(email)) {
			throw new Error(`Given email can't be empty. Received email: ${email}`);
		}

		return CampaignMonitorService.getPreferences(email);
	});
};
