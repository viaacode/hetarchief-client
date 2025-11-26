import { ObjectPlaceholder } from '@ie-objects/components/ObjectPlaceholder';
import { useGetIeObjectsTicketUrl } from '@ie-objects/hooks/use-get-ie-objects-ticket-url';
import {
	FLOWPLAYER_AUDIO_FORMATS,
	FLOWPLAYER_FORMATS,
	FLOWPLAYER_VIDEO_FORMATS,
	getTicketErrorPlaceholderLabels,
	JSON_FORMATS,
} from '@ie-objects/ie-objects.consts';
import type { IeObjectFile, IeObjectRepresentation } from '@ie-objects/ie-objects.types';
import { FlowPlayer, type FlowPlayerProps } from '@meemoo/react-components';
import type { FlowPlayerWrapperProps } from '@shared/components/FlowPlayerWrapper/FlowPlayerWrapper.types';
import { Loading } from '@shared/components/Loading';
import { getValidStartAndEnd } from '@shared/helpers/cut-start-and-end';
import { useGetPeakFile } from '@shared/hooks/use-get-peak-file/use-get-peak-file';
import clsx from 'clsx';
import getConfig from 'next/config';
import React, { type FC, useCallback, useState } from 'react';
import { convertDurationStringToSeconds, toSeconds } from '../../helpers/duration';

const { publicRuntimeConfig } = getConfig();

export const FlowPlayerWrapper: FC<FlowPlayerWrapperProps> = ({
	paused,
	onPlay,
	onPause,
	onMediaReady,
	ieObjectPage,
	dctermsFormat,
	maintainerLogo,
	owner,
	cuePoints,
	duration,
	poster,
}) => {
	const [flowPlayerKey, setFlowPlayerKey] = useState<string | null>(null);

	const allFilesToDisplayInCurrentPage =
		ieObjectPage?.representations?.flatMap((representation) =>
			representation.files.filter((file) => FLOWPLAYER_FORMATS.includes(file.mimeType))
		) || [];

	const getRepresentationByType = useCallback(
		(mimeTypes: string[]): IeObjectRepresentation | null => {
			return (
				ieObjectPage?.representations?.find((representation) =>
					representation?.files?.find((file) => mimeTypes.includes(file.mimeType))
				) || null
			);
		},
		[ieObjectPage]
	);

	const getFilesByType = useCallback(
		(mimeTypes: string[]): IeObjectFile[] => {
			return (
				getRepresentationByType(mimeTypes)?.files?.filter((file) =>
					mimeTypes.includes(file.mimeType)
				) || []
			);
		},
		[getRepresentationByType]
	);

	const currentPlayableFile: IeObjectFile | null = allFilesToDisplayInCurrentPage[0] || null;
	const fileStoredAt: string | null = currentPlayableFile?.storedAt ?? null;
	const {
		data: playableUrl,
		isLoading: isLoadingPlayableUrl,
		isFetching: isFetchingPlayableUrl,
		isError: isErrorPlayableUrl,
	} = useGetIeObjectsTicketUrl(fileStoredAt, !!fileStoredAt, () => {
		// Force flowplayer rerender after successful fetch
		setFlowPlayerKey(fileStoredAt);
		onMediaReady(!isErrorPlayableUrl && !!playableUrl && !!currentPlayableFile);
	});

	// peak file
	const peakFileStoredAt: string | null = getFilesByType(JSON_FORMATS)?.[0]?.storedAt || null;
	const { data: peakJson, isLoading: isLoadingPeakFile } = useGetPeakFile(peakFileStoredAt, {
		enabled: dctermsFormat === 'audio',
	});

	if (isLoadingPlayableUrl) {
		return <Loading fullscreen owner={`${owner}: render media`} mode="light" />;
	}

	if (isErrorPlayableUrl) {
		return <ObjectPlaceholder {...getTicketErrorPlaceholderLabels()} />;
	}

	const playableRepresentation = getRepresentationByType(FLOWPLAYER_FORMATS);
	const getStartAndEnd = () => {
		const durationInSeconds = toSeconds(duration || playableRepresentation?.schemaEndTime);
		const mapTimeToNumber = (value: string | undefined) =>
			value ? convertDurationStringToSeconds(value) : undefined;

		const start = cuePoints?.start || mapTimeToNumber(playableRepresentation?.schemaStartTime) || 0;
		const end =
			cuePoints?.end || mapTimeToNumber(playableRepresentation?.schemaEndTime) || durationInSeconds;

		return getValidStartAndEnd(start, end, durationInSeconds);
	};

	const [start, end]: [number | null, number | null] = getStartAndEnd();

	const shared: Partial<FlowPlayerProps> = {
		className: clsx('p-object-detail__flowplayer'),
		title: currentPlayableFile?.name,
		logo: maintainerLogo ?? undefined,
		pause: paused,
		onPlay,
		onPause,
		token: publicRuntimeConfig.FLOW_PLAYER_TOKEN,
		dataPlayerId: publicRuntimeConfig.FLOW_PLAYER_ID,
		plugins: ['speed', 'subtitles', 'cuepoints', 'hls', 'ga', 'audio', 'keyboard'],
		peakColorBackground: '#303030', // $shade-darker
		peakColorInactive: '#adadad', // zinc
		peakColorActive: '#00857d', // $teal
		peakHeightFactor: 0.6,
		start,
		end,
	};

	// Flowplayer
	if (playableUrl && FLOWPLAYER_VIDEO_FORMATS.includes(currentPlayableFile.mimeType)) {
		if (isFetchingPlayableUrl) {
			return <Loading fullscreen owner={`${owner}: render video`} mode="light" />;
		}
		return (
			<FlowPlayer
				key={flowPlayerKey}
				type="video"
				src={playableUrl as string}
				poster={poster}
				renderLoader={() => <Loading owner="flowplayer suspense" fullscreen mode="light" />}
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
				key={flowPlayerKey}
				type="audio"
				src={[
					{
						src: playableUrl as string,
						type: currentPlayableFile.mimeType,
					},
				]}
				waveformData={peakJson?.data || undefined}
				{...shared}
			/>
		);
	}
};
