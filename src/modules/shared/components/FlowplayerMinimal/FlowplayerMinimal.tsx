import type { IeObjectRepresentation } from '@ie-objects/ie-objects.types';
import { AudioOrVideoPlayer } from '@shared/components/AudioOrVideoPlayer/AudioOrVideoPlayer';
import Icon from '@shared/components/Icon/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { IeObjectType } from '@shared/types/ie-objects';
import { noop } from 'lodash-es';
import React, { type FC, type MouseEvent, useRef, useState } from 'react';
import styles from './FlowplayerMinimal.module.scss';

const FORMAT_TO_ICON_NAME: Record<IeObjectType, IconNamesLight> = {
	[IeObjectType.VIDEO]: IconNamesLight.Video,
	[IeObjectType.AUDIO]: IconNamesLight.Audio,
	[IeObjectType.NEWSPAPER]: IconNamesLight.Newspaper,
	[IeObjectType.VIDEO_FRAGMENT]: IconNamesLight.Video,
	[IeObjectType.FILM]: IconNamesLight.Video,
	[IeObjectType.AUDIO_FRAGMENT]: IconNamesLight.Audio,
	[IeObjectType.NEWSPAPER_PAGE]: IconNamesLight.Newspaper,
	[IeObjectType.IMAGE]: IconNamesLight.Image,
};

interface FlowplayerMinimalProps {
	id: string;
	dctermsFormat: IeObjectType;
	schemaIdentifier: string;
	representation: IeObjectRepresentation;
	poster: string;
	isPaused: boolean;
	setIsPaused: (isPaused: boolean) => void;
	autoplay?: boolean;
	isMuted: boolean;
	setIsMuted: (isMuted: boolean) => void;
}

export const FlowplayerMinimal: FC<FlowplayerMinimalProps> = ({
	id,
	dctermsFormat,
	schemaIdentifier,
	representation,
	poster,
	autoplay = false,
	isPaused,
	setIsPaused,
	isMuted,
	setIsMuted,
}: FlowplayerMinimalProps) => {
	const flowplayerMinimalRef = useRef(null);
	const [currentTime, setCurrentTime] = useState<number>(0);
	const [duration, setDuration] = useState<number>(0);
	const playbackPercentage: number =
		currentTime > 0 && duration > 0 ? (currentTime / duration) * 100 : 0;
	const [playbackPercentageHover, setPlaybackPercentageHover] = useState(0);

	const handleTogglePlayClick = () => {
		if (autoplay) {
		}
		setIsPaused(!isPaused);
	};

	const handleMouseMove = (evt: MouseEvent<HTMLDivElement>) => {
		const mouseX = evt.pageX;
		const trackElement = evt.target as HTMLDivElement;
		const trackElementRect = trackElement.getBoundingClientRect();
		const trackX = trackElementRect.left;
		const trackWidth = trackElement.offsetWidth;
		const newPlaybackPercentageHover = ((mouseX - trackX) / trackWidth) * 100;
		console.log('hover: ', { mouseX, trackX, trackWidth, newPlaybackPercentageHover });
		setPlaybackPercentageHover(newPlaybackPercentageHover);
	};

	const handleTrackMouseClick = () => {
		const newCurrentTime = (playbackPercentageHover * duration) / 100;
		setCurrentTime(newCurrentTime);
		if (flowplayerMinimalRef.current) {
			const videoElement = (flowplayerMinimalRef.current as HTMLDivElement).querySelector('video');
			if (videoElement) {
				videoElement.currentTime = newCurrentTime;
			}
		}
	};

	return (
		<div className={styles['c-flowplayer-minimal']} ref={flowplayerMinimalRef}>
			<AudioOrVideoPlayer
				locationId={`flowplayer-minimal--${id}`}
				representation={representation}
				dctermsFormat={dctermsFormat}
				schemaIdentifier={schemaIdentifier}
				poster={poster}
				isPaused={isPaused}
				autoplay={autoplay}
				onPlay={noop}
				onPause={noop}
				// isMuted={isMuted}
				// setIsMuted={setIsMuted}
				onMediaReady={noop}
				maintainerLogo={null}
				cuePoints={undefined}
				onTimeUpdate={(newTime) => {
					setCurrentTime(newTime);
				}}
				onMediaDurationLoaded={(newDuration) => {
					setDuration(newDuration);
				}}
			></AudioOrVideoPlayer>
			<button
				type="button"
				className="c-flowplayer-minimal__play-toggle"
				onClick={handleTogglePlayClick}
			></button>
			{/** biome-ignore lint/a11y/noStaticElementInteractions: this is a video trackbar, that you can click */}
			{/** biome-ignore lint/a11y/useKeyWithClickEvents: this is a video trackbar, that you can click, key up doesn't make sense, since it can't provide an x-coordinate */}
			<div
				className="c-flowplayer-minimal__trackbar-hitbox"
				onMouseMove={handleMouseMove}
				onClick={handleTrackMouseClick}
			>
				<div className="c-flowplayer-minimal__trackbar">
					<div
						className="c-flowplayer-minimal__trackbar__filled"
						style={{ width: `${playbackPercentage}%` }}
					></div>
					<div
						className="c-flowplayer-minimal__trackbar__hover"
						style={{ width: `${playbackPercentageHover}%` }}
					></div>
				</div>
			</div>
			<div className="c-flowplayer-minimal__icon">
				<Icon name={FORMAT_TO_ICON_NAME[dctermsFormat]} />
			</div>
		</div>
	);
};
