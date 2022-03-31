import { useQuery, UseQueryResult } from 'react-query';
import { JsonWaveformData } from 'waveform-data';

export function useGetDefaultPeak(enabled = false): UseQueryResult<JsonWaveformData> {
	return useQuery(
		['default-peak'],
		() => fetch('/peak/peakfile.json').then((res) => res.json()),
		{ enabled }
	);
}
