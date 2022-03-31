import { useQuery, UseQueryResult } from 'react-query';

export function useGetDefaultPeak(enabled = false): UseQueryResult<any> {
	return useQuery(
		['default-peak'],
		() => fetch('/peak/peakfile.json').then((res) => res.json()),
		{ enabled }
	);
}
