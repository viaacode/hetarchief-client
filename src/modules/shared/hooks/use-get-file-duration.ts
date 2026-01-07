import { QUERY_KEYS } from '@shared/const/query-keys';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';

export const useGetFileDuration = (
	playableUrl: string | undefined | null
): UseQueryResult<number> => {
	return useQuery(
		[QUERY_KEYS.getIeObjectPlayerDuration, playableUrl],
		() =>
			new Promise((resolve, reject) => {
				if (!playableUrl) {
					return reject(undefined);
				}

				const video = document.createElement('video');
				video.preload = 'metadata';

				video.onloadedmetadata = () => {
					window.URL.revokeObjectURL(video.src);
					return resolve(video.duration);
				};

				video.onerror = () => {
					return reject(undefined);
				};

				video.src = playableUrl;
			}),
		{
			enabled: !!playableUrl,
			keepPreviousData: true,
			cacheTime: 30 * 60 * 1000, // 30 minutes
			staleTime: 30 * 60 * 1000, // 30 minutes
		}
	);
};
