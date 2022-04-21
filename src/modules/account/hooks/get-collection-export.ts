import { useMutation } from 'react-query';
import { UseMutationResult } from 'react-query/types/react/types';

import { collectionsService } from '@account/services/collections';

export function useGetCollectionExport(): UseMutationResult<Blob | null, unknown, string> {
	return useMutation((id: string) => collectionsService.getExport(id));
}
