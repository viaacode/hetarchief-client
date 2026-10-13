import { isSeekingPlayerVideo } from '@ie-objects/utils/seek-player-video';
import { useCallback, useEffect, useRef } from 'react';

/**
 * Flowplayer reports only its first play. When that is the muted play of a seek (see
 * seekPlayerVideo) it is no playback, but the report is then used up: the user's own first play is
 * forwarded from the video element instead.
 *
 * - handlePlay: the player's onPlay
 * - listenToVideo: the player's onReady (the video element)
 */
export const usePlayAfterSeek = (onUserPlay: () => void) => {
	// Refs: Flowplayer keeps the handlers of its first render
	const onUserPlayRef = useRef(onUserPlay);
	useEffect(() => {
		onUserPlayRef.current = onUserPlay;
	}, [onUserPlay]);

	const isReportSwallowedRef = useRef(false);
	const listenerAbortRef = useRef<AbortController | null>(null);

	const handlePlay = useCallback(() => {
		if (isSeekingPlayerVideo()) {
			isReportSwallowedRef.current = true;
			return;
		}
		isReportSwallowedRef.current = false;
		onUserPlayRef.current();
	}, []);

	const listenToVideo = useCallback((video: HTMLVideoElement) => {
		// A player that is mounted again has a new video element
		listenerAbortRef.current?.abort();
		const abortController = new AbortController();
		listenerAbortRef.current = abortController;
		isReportSwallowedRef.current = false;

		video.addEventListener(
			'playing',
			() => {
				if (isReportSwallowedRef.current && !isSeekingPlayerVideo()) {
					isReportSwallowedRef.current = false;
					onUserPlayRef.current();
				}
			},
			{ signal: abortController.signal }
		);
	}, []);

	useEffect(() => () => listenerAbortRef.current?.abort(), []);

	return { handlePlay, listenToVideo };
};
