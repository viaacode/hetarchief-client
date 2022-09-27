import { useMutation } from 'react-query';
import { UseMutationResult } from 'react-query/types/react/types';

import { foldersService } from '@account/services/folders';

export function useGetFolderExport(): UseMutationResult<Blob | null, unknown, string> {
	return useMutation((id: string) => foldersService.getExport(id));
}
