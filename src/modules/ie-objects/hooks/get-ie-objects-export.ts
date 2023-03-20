import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { IeMetadataExportProps } from '@ie-objects/types';

import { IeObjectsService } from './../services';

export const useGetIeObjectsExport = (): UseMutationResult<
	Blob | null,
	unknown,
	IeMetadataExportProps
> => {
	return useMutation((props: IeMetadataExportProps) => IeObjectsService.getExport(props));
};
