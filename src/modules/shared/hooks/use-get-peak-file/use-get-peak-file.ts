import ky from 'ky-universal';
import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { MediaService } from '@media/services';
import { Media } from '@media/types';
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
		const jsonFileUrl: string | null = await MediaService.getPlayableUrl(
			fileSchemaIdentifier as string
		);
		if (!jsonFileUrl) {
			throw new Error('Failed to get peak file url with token');
		}

		const peakFileResponse = await ky.get(jsonFileUrl);
		const peakFileJson = (await peakFileResponse.json()) as JsonWaveformData;
		return peakFileJson;
	});
}
