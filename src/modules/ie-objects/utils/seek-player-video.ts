// Flowplayer drives a video.fp-engine element for audio as well. Not rendered on mobile while
// another tab is open.
export const getPlayerVideoElement = (): HTMLVideoElement | null =>
	document.querySelector<HTMLVideoElement>(
		'.p-object-detail__flowplayer.c-video-player video.fp-engine'
	);

/**
 * Moves the player to a moment without changing whether it plays.
 *
 * Flowplayer only drops its poster (and shows its controls) once playback has started, so on a
 * player that hasn't played yet the frame at the new position would stay hidden. The same muted
 * play-then-pause that react-components uses to initialize embedded players reveals it, without
 * the user hearing anything or the video running on.
 */
export const seekPlayerVideo = async (video: HTMLVideoElement, seconds: number): Promise<void> => {
	video.currentTime = seconds;

	if (!video.closest('.is-starting')) {
		return;
	}

	const wasMuted = video.muted;
	video.muted = true;
	try {
		await video.play();
		video.pause();
	} catch {
		// Playback was refused: the poster stays, the position is still set
	} finally {
		video.muted = wasMuted;
		// Flowplayer jumps to the first cue point on its first playback, so set the position again
		video.currentTime = seconds;
	}
};
