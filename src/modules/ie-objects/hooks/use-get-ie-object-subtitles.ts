import { IeObjectsService } from '@ie-objects/services/ie-objects/ie-objects.service';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

interface UseGetIeObjectSubtitles {
	subtitlesUrl: string | undefined;
	isLoading: boolean;
}

/**
 * Fetched here and handed over as a blob url because the track inherits the CORS mode of the video,
 * which cannot send the session cookie to the proxy and still play from the media host.
 * A failing or slow request just means no subtitles.
 */
export const useGetIeObjectSubtitles = (
	fileId: string | undefined | null,
	schemaIdentifier: string | undefined | null
): UseGetIeObjectSubtitles => {
	const { data: subtitles, isLoading } = useQuery({
		queryKey: [QUERY_KEYS.getIeObjectSubtitles, schemaIdentifier, fileId],
		queryFn: () => IeObjectsService.getSubtitles(fileId as string, schemaIdentifier as string),
		enabled: !!fileId && !!schemaIdentifier,
		retry: false,
		staleTime: 30 * 60 * 1000, // 30 minutes
	});

	const [subtitlesUrl, setSubtitlesUrl] = useState<string | undefined>(undefined);

	useEffect(() => {
		if (!subtitles) {
			setSubtitlesUrl(undefined);
			return;
		}

		const url = URL.createObjectURL(subtitles);
		setSubtitlesUrl(url);
		return () => URL.revokeObjectURL(url);
	}, [subtitles]);

	return { subtitlesUrl, isLoading: isLoading || (!!subtitles && !subtitlesUrl) };
};
