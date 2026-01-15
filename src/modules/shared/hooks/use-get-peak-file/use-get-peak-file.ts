import { IeObjectsService } from '@ie-objects/services';
import { QUERY_KEYS } from '@shared/const';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import ky from 'ky-universal';

export interface JsonWaveformData {
	version: number;
	channels: number;
	sample_rate: number;
	samples_per_pixel: number;
	bits: number;
	length: number;
	data: Array<number>;
}

export function useGetPeakFile(
	filePath: string | null,
	enabled: boolean = true
): UseQueryResult<JsonWaveformData | null> {
	return useQuery({
		queryKey: [QUERY_KEYS.getPeakFile, filePath],
		queryFn: async () => {
			if (!filePath) {
				return null;
			}
			const jsonFileUrl: string | null = await IeObjectsService.getPlayableUrl(filePath as string);
			if (!jsonFileUrl) {
				throw new Error('Failed to get peak file url with token');
			}

			const peakFileResponse = await ky.get(jsonFileUrl);
			return (await peakFileResponse.json()) as JsonWaveformData;
		},
		enabled,
	});
}
