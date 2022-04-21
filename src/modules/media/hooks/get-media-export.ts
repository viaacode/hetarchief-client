import { useMutation } from 'react-query';
import { UseMutationResult } from 'react-query/types/react/types';

import { MediaService } from '@media/services';

export function useGetMediaExport(): UseMutationResult<Blob | null, unknown, string> {
	return useMutation((id: string) => MediaService.getExport(id));
}
