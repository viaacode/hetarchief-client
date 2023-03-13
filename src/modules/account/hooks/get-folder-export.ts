import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { foldersService } from '@account/services/folders';

export function useGetFolderExport(): UseMutationResult<Blob | null, unknown, string> {
	return useMutation((id: string) => foldersService.getExport(id));
}
