import { QUERY_KEYS } from '@shared/const/query-keys';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export const useGetFileDuration = (playableUrl: string | undefined | null) => {
	return useQuery<number>({
		queryKey: [QUERY_KEYS.getIeObjectPlayerDuration, playableUrl],
		queryFn: () =>
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

		enabled: !!playableUrl,
		placeholderData: keepPreviousData,
		staleTime: 30 * 60 * 1000, // 30 minutes
	});
};
