import { useQuery, UseQueryResult } from '@tanstack/react-query';
import ky from 'ky-universal';

import { IeObjectsService } from '@ie-objects/services';
import { QUERY_KEYS } from '@shared/const';

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
	fileSchemaIdentifier: string | null
): UseQueryResult<JsonWaveformData | null> {
	return useQuery([QUERY_KEYS.getPeakFile, { fileSchemaIdentifier }], async () => {
		if (!fileSchemaIdentifier) {
			return null;
		}
		const jsonFileUrl: string | null = await IeObjectsService.getPlayableUrl(
			fileSchemaIdentifier as string
		);
		if (!jsonFileUrl) {
			throw new Error('Failed to get peak file url with token');
		}

		const peakFileResponse = await ky.get(jsonFileUrl);
		return (await peakFileResponse.json()) as JsonWaveformData;
	});
}
