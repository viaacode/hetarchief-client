import ky from 'ky-universal';
import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { MediaService } from '@media/services';
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
): UseQueryResult<JsonWaveformData> {
	return useQuery(
		[QUERY_KEYS.getPeakFile, { fileSchemaIdentifier }],
		async () => {
			const jsonFileUrl: string | null = await MediaService.getPlayableUrl(
				fileSchemaIdentifier as string
			);
			if (!jsonFileUrl) {
				throw new Error('Failed to get peak file url with token');
			}

			// TODO REMOVE mock once there are peak file examples on INT/localhost
			const peakFileResponse = await ky.get(
				'https://archief-media-qas.viaa.be/viaa/KULEUVENKADOC/c7ccfe6fb5db4ae6a8d697a6b01cc7c264c803ee96ea40dc9b832c3be8ff0528/peak-0.json'
			);
			// const peakFileResponse = await ky.get(jsonFileUrl);
			const peakFileJson = (await peakFileResponse.json()) as JsonWaveformData;
			console.log(peakFileJson);
			return peakFileJson;
		},
		{
			enabled: !!fileSchemaIdentifier,
		}
	);
}
