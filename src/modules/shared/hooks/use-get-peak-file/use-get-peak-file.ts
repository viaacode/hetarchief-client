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
	fileRepresentationSchemaIdentifier: string | null,
	fileSchemaIdentifier: string | null
): UseQueryResult<JsonWaveformData | null> {
	return useQuery(
		[QUERY_KEYS.getPeakFile, { fileRepresentationSchemaIdentifier, fileSchemaIdentifier }],
		async () => {
			if (!fileRepresentationSchemaIdentifier) {
				return null;
			}
			const jsonFileUrl: string | null = await IeObjectsService.getPlayableUrl(
				fileRepresentationSchemaIdentifier as string,
				fileSchemaIdentifier as string
			);
			if (!jsonFileUrl) {
				throw new Error('Failed to get peak file url with token');
			}

			const peakFileResponse = await ky.get(jsonFileUrl);
			return (await peakFileResponse.json()) as JsonWaveformData;
		}
	);
}
