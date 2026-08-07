import { ObjectPlaceholder } from '@ie-objects/components/ObjectPlaceholder';
import { useGetIeObjectsTicketUrl } from '@ie-objects/hooks/use-get-ie-objects-ticket-url';
import {
	FLOWPLAYER_AUDIO_FORMATS,
	FLOWPLAYER_FORMATS,
	FLOWPLAYER_VIDEO_FORMATS,
	getTicketErrorPlaceholderLabels,
	JSON_FORMATS,
} from '@ie-objects/ie-objects.consts';
import type { IeObjectFile } from '@ie-objects/ie-objects.types';
import { FlowPlayer, type FlowPlayerProps, getValidStartAndEnd } from '@meemoo/react-components';
import { Loading } from '@shared/components/Loading';
import getConfig from '@shared/config/public-runtime-config';
import { useGetFileDuration } from '@shared/hooks/use-get-file-duration';
import { useGetPeakFile } from '@shared/hooks/use-get-peak-file/use-get-peak-file';
import { IeObjectType } from '@shared/types/ie-objects';
import { isNil } from 'es-toolkit/compat';
import React, { type FC, useCallback, useEffect, useState } from 'react';
import type { AudioOrVideoPlayerProps } from './AudioOrVideoPlayer.types';

const { publicRuntimeConfig } = getConfig();

export const AudioOrVideoPlayer: FC<AudioOrVideoPlayerProps> = ({
	className,
	allowFullScreen = true,
	paused,
	onPlay,
	onPause,
	onMediaReady,
	onMediaDurationLoaded,
	representation,
	dctermsFormat,
	schemaIdentifier,
	maintainerLogo,
	locationId,
	cuePoints,
	poster,
}) => {
	const [flowPlayerKey, setFlowPlayerKey] = useState<string | null>(null);

	const allFilesToInRepresentation =
		representation?.files.filter((file) => FLOWPLAYER_FORMATS.includes(file.mimeType)) || [];

	const getFilesByType = useCallback(
		(mimeTypes: string[]): IeObjectFile[] => {
			return representation?.files?.filter((file) => mimeTypes.includes(file.mimeType)) || [];
		},
		[representation]
	);

	const currentPlayableFile: IeObjectFile | null = allFilesToInRepresentation?.[0] || null;

	const fileId: string | null = currentPlayableFile?.id ?? null;
	const {
		data: playableUrl,
		isLoading: isLoadingPlayableUrl,
		isFetching: isFetchingPlayableUrl,
		isError: isErrorPlayableUrl,
	} = useGetIeObjectsTicketUrl(fileId, schemaIdentifier);

	const {
		data: mediaDuration,
		isLoading: isLoadingMediaDuration,
		isError: isErrorMediaDuration,
	} = useGetFileDuration(playableUrl);

	useEffect(() => {
		if (!isLoadingPlayableUrl && !isFetchingPlayableUrl) {
			// Force flowplayer rerender after successful fetch
			setFlowPlayerKey(fileId);
			onMediaReady(
				!isErrorPlayableUrl && !!playableUrl && !!currentPlayableFile,
				currentPlayableFile
			);
		}
	}, [
		isLoadingPlayableUrl,
		isFetchingPlayableUrl,
		isErrorPlayableUrl,
		playableUrl,
		currentPlayableFile,
		fileId,
		onMediaReady,
	]);

	useEffect(() => {
		if (!isLoadingMediaDuration && !isErrorMediaDuration && !isNil(mediaDuration)) {
			onMediaDurationLoaded?.(mediaDuration);
		}
	}, [mediaDuration, onMediaDurationLoaded, isLoadingMediaDuration, isErrorMediaDuration]);

	// peak file
	const peakFile: IeObjectFile | null = getFilesByType(JSON_FORMATS)?.[0] || null;
	const { data: peakJson, isLoading: isLoadingPeakFile } = useGetPeakFile(
		peakFile?.id,
		schemaIdentifier,
		dctermsFormat === IeObjectType.AUDIO || dctermsFormat === IeObjectType.AUDIO_FRAGMENT
	);

	if (isLoadingPlayableUrl || isLoadingMediaDuration) {
		return <Loading fullscreen locationId={`${locationId}: render media`} mode="light" />;
	}

	if (isErrorPlayableUrl || !currentPlayableFile || isErrorMediaDuration) {
		return <ObjectPlaceholder {...getTicketErrorPlaceholderLabels()} />;
	}

	const getStartAndEnd = () => {
		let cueStart: number | null = null;
		let cueEnd: number | null = null;

		// Only cuepoints if there are any set, and they do not fall outside the range of the video itself
		if (cuePoints) {
			if (
				cuePoints.start &&
				cuePoints.start > 0 &&
				(isNil(mediaDuration) || cuePoints.start < mediaDuration)
			) {
				cueStart = cuePoints.start;
			}

			if (
				cuePoints.end &&
				(isNil(mediaDuration) ||
					(cuePoints.end && cuePoints.end < mediaDuration && cuePoints.end > 0))
			) {
				cueEnd = cuePoints.end;
			}
		}

		return getValidStartAndEnd(cueStart, cueEnd, mediaDuration);
	};

	// For main ie objects, the representation thumbnail is always null
	// For cut fragments, the representation thumbnail is defined
	const thumbnailUrl = representation?.thumbnailUrl || currentPlayableFile?.thumbnailUrl;

	const [start, end]: [number | null, number | null] = getStartAndEnd();
	const shared: Partial<FlowPlayerProps> = {
		className,
		title: currentPlayableFile?.name,
		logo: maintainerLogo ?? undefined,
		pause: paused,
		onPlay,
		onPause,
		token: publicRuntimeConfig.FLOW_PLAYER_TOKEN,
		dataPlayerId: publicRuntimeConfig.FLOW_PLAYER_ID,
		ui: allowFullScreen ? undefined : 1, // 1 = NO_FULLSCREEN
		plugins: ['speed', 'subtitles', 'cuepoints', 'hls', 'ga', 'audio', 'keyboard'],
		peakColorBackground: '#303030', // $shade-darker
		peakColorInactive: '#adadad', // zinc
		peakColorActive: '#00857d', // $teal
		peakHeightFactor: 0.6,
		start,
		end,
	};

	if (playableUrl && FLOWPLAYER_VIDEO_FORMATS.includes(currentPlayableFile.mimeType)) {
		if (isFetchingPlayableUrl) {
			return <Loading fullscreen locationId={`${locationId}: render video`} mode="light" />;
		}
		return (
			<FlowPlayer
				key={`${flowPlayerKey}__${currentPlayableFile.id}`}
				type="video"
				src={playableUrl as string}
				poster={poster || thumbnailUrl}
				renderLoader={() => <Loading locationId="flowplayer suspense" fullscreen mode="light" />}
				preload="metadata"
				{...shared}
			/>
		);
	}
	// Audio player
	if (playableUrl && FLOWPLAYER_AUDIO_FORMATS.includes(currentPlayableFile.mimeType)) {
		if (peakFile?.storedAt && isLoadingPeakFile) {
			return (
				<Loading
					fullscreen
					locationId={`${locationId}: render media audio peak file`}
					mode="light"
				/>
			);
		}
		return (
			<FlowPlayer
				key={`${flowPlayerKey}__${currentPlayableFile.id}`}
				type="audio"
				src={[
					{
						src: playableUrl as string,
						type: currentPlayableFile.mimeType,
					},
				]}
				waveformData={peakJson?.data || undefined}
				preload="metadata"
				{...shared}
			/>
		);
	}
};
