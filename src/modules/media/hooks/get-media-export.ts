import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { MediaService } from '@media/services';

export function useGetMediaExport(): UseMutationResult<Blob | null, unknown, string> {
	return useMutation((id: string) => MediaService.getExport(id));
}
