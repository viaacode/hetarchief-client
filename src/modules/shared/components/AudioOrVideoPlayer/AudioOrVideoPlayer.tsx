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
import { FlowPlayer, type FlowPlayerProps } from '@meemoo/react-components';
import { Loading } from '@shared/components/Loading';
import { getValidStartAndEnd } from '@shared/helpers/cut-start-and-end';
import { useGetPeakFile } from '@shared/hooks/use-get-peak-file/use-get-peak-file';
import getConfig from 'next/config';
import React, { type FC, useCallback, useEffect, useState } from 'react';
import { convertDurationStringToSeconds, toSeconds } from '../../helpers/duration';
import type { AudioOrVideoPlayerProps } from './AudioOrVideoPlayer.types';

const { publicRuntimeConfig } = getConfig();

export const AudioOrVideoPlayer: FC<AudioOrVideoPlayerProps> = ({
	className,
	allowFullScreen = true,
	paused,
	onPlay,
	onPause,
	onMediaReady,
	onMetadataLoaded,
	representation,
	dctermsFormat,
	maintainerLogo,
	owner,
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
	const fileStoredAt: string | null = currentPlayableFile?.storedAt ?? null;
	const {
		data: playableUrl,
		isLoading: isLoadingPlayableUrl,
		isFetching: isFetchingPlayableUrl,
		isError: isErrorPlayableUrl,
	} = useGetIeObjectsTicketUrl(fileStoredAt, !!fileStoredAt);

	useEffect(() => {
		if (!isLoadingPlayableUrl && !isFetchingPlayableUrl) {
			// Force flowplayer rerender after successful fetch
			setFlowPlayerKey(fileStoredAt);
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
		fileStoredAt,
		onMediaReady,
	]);

	// peak file
	const peakFileStoredAt: string | null = getFilesByType(JSON_FORMATS)?.[0]?.storedAt || null;
	const { data: peakJson, isLoading: isLoadingPeakFile } = useGetPeakFile(peakFileStoredAt, {
		enabled: dctermsFormat === 'audio',
	});

	if (isLoadingPlayableUrl) {
		return <Loading fullscreen owner={`${owner}: render media`} mode="light" />;
	}

	if (isErrorPlayableUrl || !currentPlayableFile) {
		return <ObjectPlaceholder {...getTicketErrorPlaceholderLabels()} />;
	}

	const getStartAndEnd = () => {
		const durationInSeconds = toSeconds(currentPlayableFile?.duration);
		const mapTimeToNumber = (value: string | undefined) =>
			value ? convertDurationStringToSeconds(value) : undefined;

		const start = cuePoints?.start || mapTimeToNumber(representation?.schemaStartTime) || 0;
		const end =
			cuePoints?.end || mapTimeToNumber(representation?.schemaEndTime) || durationInSeconds;

		return getValidStartAndEnd(start, end, durationInSeconds);
	};

	const handleMetadataLoaded = (evt: Event) => {
		onMetadataLoaded?.(evt);
	};

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
			return <Loading fullscreen owner={`${owner}: render video`} mode="light" />;
		}
		return (
			<FlowPlayer
				key={`${flowPlayerKey}__${currentPlayableFile.id}`}
				type="video"
				src={playableUrl as string}
				poster={poster || currentPlayableFile.thumbnailUrl}
				renderLoader={() => <Loading owner="flowplayer suspense" fullscreen mode="light" />}
				preload="metadata"
				onMetadataLoaded={handleMetadataLoaded}
				{...shared}
			/>
		);
	}
	// Audio player
	if (playableUrl && FLOWPLAYER_AUDIO_FORMATS.includes(currentPlayableFile.mimeType)) {
		if (peakFileStoredAt && isLoadingPeakFile) {
			return <Loading fullscreen owner={`${owner}: render media audio peak file`} mode="light" />;
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
				onMetadataLoaded={handleMetadataLoaded}
				{...shared}
			/>
		);
	}
};
