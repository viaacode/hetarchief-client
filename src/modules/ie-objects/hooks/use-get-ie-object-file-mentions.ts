import type { FileMentionsResponse } from '@ie-objects/ie-objects.types';
import { IeObjectsService } from '@ie-objects/services';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';

// A 403/404 (no licence, sector logic, ...) is an expected "nothing to show", so don't retry it
export const useGetIeObjectFileMentions = (
	schemaIdentifier: string | undefined | null,
	fileId: string | undefined | null,
	options: Partial<{ enabled: boolean }> = {}
): UseQueryResult<FileMentionsResponse> => {
	const { enabled = true } = options;
	return useQuery({
		queryKey: [QUERY_KEYS.getIeObjectFileMentions, schemaIdentifier, fileId],
		queryFn: () => IeObjectsService.getFileMentions(schemaIdentifier as string, fileId as string),
		enabled: enabled && !!schemaIdentifier && !!fileId,
		retry: false,
	});
};
