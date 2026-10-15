import { ObjectPlaceholder } from '@ie-objects/components/ObjectPlaceholder';
import { useGetIeObjectSubtitles } from '@ie-objects/hooks/use-get-ie-object-subtitles';
import { useGetIeObjectsTicketUrl } from '@ie-objects/hooks/use-get-ie-objects-ticket-url';
import {
	FLOWPLAYER_AUDIO_FORMATS,
	FLOWPLAYER_FORMATS,
	FLOWPLAYER_VIDEO_FORMATS,
	getTicketErrorPlaceholderLabels,
	JSON_FORMATS,
} from '@ie-objects/ie-objects.consts';
import { getSubtitleFile, getSubtitleTracks } from '@ie-objects/utils/get-subtitle-tracks';
import {
	Color,
	FLOWPLAYER_CUSTOM_CONTROL_COLORS_HET_ARCHIEF,
	isAudioType,
} from '@meemoo/admin-core-ui/admin';
import {
	FlowPlayer,
	type FlowPlayerCustomControlsConfig,
	type FlowPlayerProps,
	getValidStartAndEnd,
} from '@meemoo/react-components';
import { Loading } from '@shared/components/Loading';
import { SubtitlesTeaser } from '@shared/components/SubtitlesTeaser';
import getConfig from '@shared/config/public-runtime-config';
import { tText } from '@shared/helpers/translate';
import { useGetFileDuration } from '@shared/hooks/use-get-file-duration';
import { useGetPeakFile } from '@shared/hooks/use-get-peak-file/use-get-peak-file';
import type { HetArchiefIeObjectFile } from '@viaa/avo2-types';
import { isNil } from 'es-toolkit/compat';
import React, {
	type ComponentProps,
	type FC,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import type { AudioOrVideoPlayerProps } from './AudioOrVideoPlayer.types';

const { publicRuntimeConfig } = getConfig();

export const AudioOrVideoPlayer: FC<AudioOrVideoPlayerProps> = ({
	className,
	allowFullScreen = true,
	paused,
	onPlay,
	onPause,
	onMediaReady,
	onPlayerReady,
	onMediaDurationLoaded,
	representation,
	dctermsFormat,
	schemaIdentifier,
	maintainerLogo,
	locationId,
	cuePoints,
	poster,
	startTime,
	endTime,
}) => {
	const [flowPlayerKey, setFlowPlayerKey] = useState<string | null>(null);
	const [playerRoot, setPlayerRoot] = useState<HTMLElement | null>(null);

	const allFilesToInRepresentation =
		representation?.files.filter((file) => FLOWPLAYER_FORMATS.includes(file.mimeType)) || [];

	const getFilesByType = useCallback(
		(mimeTypes: string[]): HetArchiefIeObjectFile[] => {
			return representation?.files?.filter((file) => mimeTypes.includes(file.mimeType)) || [];
		},
		[representation]
	);

	const currentPlayableFile: HetArchiefIeObjectFile | null =
		allFilesToInRepresentation?.[0] || null;

	const fileId: string | null = currentPlayableFile?.id ?? null;
	const {
		data: playableUrl,
		isLoading: isLoadingPlayableUrl,
		isFetching: isFetchingPlayableUrl,
		isError: isErrorPlayableUrl,
	} = useGetIeObjectsTicketUrl(fileId, schemaIdentifier, true, startTime, endTime);

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
	const peakFile: HetArchiefIeObjectFile | null = getFilesByType(JSON_FORMATS)?.[0] || null;
	const { data: peakJson, isLoading: isLoadingPeakFile } = useGetPeakFile(
		peakFile?.id,
		schemaIdentifier,
		isAudioType(dctermsFormat)
	);

	const subtitleFile = getSubtitleFile(representation?.files);
	const { subtitlesUrl, isLoading: isLoadingSubtitles } = useGetIeObjectSubtitles(
		subtitleFile?.id,
		schemaIdentifier
	);
	// The player re-initialises whenever the subtitles prop changes identity
	const subtitleTracks = useMemo(
		() =>
			getSubtitleTracks(subtitleFile, {
				src: subtitlesUrl,
				label: tText(
					'modules/shared/components/audio-or-video-player/audio-or-video-player___nederlands'
				),
				disclaimer: tText(
					'modules/shared/components/audio-or-video-player/audio-or-video-player___ondertitels-zijn-ai-gegenereerd-door-meemoo-er-werd-geen-menselijke-controle-op-uitgevoerd'
				),
			}),
		[subtitleFile, subtitlesUrl]
	);

	const handlePlayerReady = useCallback(
		(video: HTMLVideoElement) => {
			const root = video.closest<HTMLElement>('.c-video-player-inner');
			setPlayerRoot(root);
			onPlayerReady?.(video, root);
		},
		[onPlayerReady]
	);

	// Subtitles added later would re-initialise the player while it plays
	if (isLoadingPlayableUrl || isLoadingMediaDuration || isLoadingSubtitles) {
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

	const [start, end]: [number | null, number | null] = getStartAndEnd();
	const sharedCustomControls: Partial<FlowPlayerCustomControlsConfig> = {
		showTitleOverlay: true,
		peakColorActive: Color.Jade,
		peakColorInactive: Color.White,
		colors: FLOWPLAYER_CUSTOM_CONTROL_COLORS_HET_ARCHIEF(),
	};
	const shared: Partial<FlowPlayerProps> = {
		className,
		title: currentPlayableFile?.name,
		logo: maintainerLogo ?? undefined,
		pause: paused,
		onPlay,
		onPause,
		onReady: handlePlayerReady,
		token: publicRuntimeConfig.FLOW_PLAYER_TOKEN,
		dataPlayerId: publicRuntimeConfig.FLOW_PLAYER_ID,
		ui: allowFullScreen ? undefined : 1, // 1 = NO_FULLSCREEN
		plugins: ['speed', 'subtitles', 'cuepoints', 'hls', 'ga', 'audio', 'keyboard'],
		peakColorBackground: Color.Ink,
		peakColorInactive: Color.Zinc,
		peakColorActive: Color.Jade,
		peakHeightFactor: 0.6,
		start,
		end,
		controlsVariant: 'custom',
		preload: 'metadata',
		subtitles: subtitleTracks,
	};

	const renderFlowPlayer = (
		typeProps: Pick<ComponentProps<typeof FlowPlayer>, 'type' | 'src'> &
			Partial<ComponentProps<typeof FlowPlayer>>
	) => (
		<>
			<FlowPlayer
				// A fragment shares its file with its parent, but has its own (cut) url: the player only reads src on mount
				key={`${flowPlayerKey}__${currentPlayableFile.id}__${schemaIdentifier}`}
				{...shared}
				{...typeProps}
				customControlsConfig={{
					...sharedCustomControls,
					showFullscreen: typeProps.type === 'video',
				}}
			/>
			{subtitleTracks && <SubtitlesTeaser playerRoot={playerRoot} />}
		</>
	);

	if (playableUrl && FLOWPLAYER_VIDEO_FORMATS.includes(currentPlayableFile.mimeType)) {
		if (isFetchingPlayableUrl) {
			return <Loading fullscreen locationId={`${locationId}: render video`} mode="light" />;
		}
		return renderFlowPlayer({
			type: 'video',
			src: playableUrl,
			poster: poster || representation?.thumbnailUrl || currentPlayableFile.thumbnailUrl,
			renderLoader: () => <Loading locationId="flowplayer suspense" fullscreen mode="light" />,
		});
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
		return renderFlowPlayer({
			type: 'audio',
			src: [{ src: playableUrl, type: currentPlayableFile.mimeType }],
			waveformData: peakJson?.data || undefined,
		});
	}
};
