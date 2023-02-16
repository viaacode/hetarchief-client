import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { IeObjectsService } from 'modules/ie-objects/services';

export function useGetIeObjectsExport(): UseMutationResult<Blob | null, unknown, string> {
	return useMutation((id: string) => IeObjectsService.getExport(id));
}
