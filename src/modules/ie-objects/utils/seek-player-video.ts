// Flowplayer drives a video.fp-engine element for audio as well. Not rendered on mobile while
// another tab is open.
export const getPlayerVideoElement = (): HTMLVideoElement | null =>
	document.querySelector<HTMLVideoElement>(
		'.p-object-detail__flowplayer.c-video-player video.fp-engine'
	);

let seekPlaysInProgress = 0;
// Seeks that are between muting the video and restoring its sound, which can overlap
let mutingSeeks = 0;
let mutedBeforeSeeks = false;

/**
 * True while a seek plays the video muted to reveal the frame, until the pause that ends it has been
 * delivered. The play and pause events of that are not the user playing: play and pause handlers
 * should ignore them.
 */
export const isSeekingPlayerVideo = (): boolean => seekPlaysInProgress > 0;

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

	// A seek that starts while another one is muting would otherwise take that mute for the user's choice
	if (mutingSeeks === 0) {
		mutedBeforeSeeks = video.muted;
	}
	mutingSeeks++;
	video.muted = true;
	seekPlaysInProgress++;
	let isReleased = false;
	const release = () => {
		if (!isReleased) {
			isReleased = true;
			seekPlaysInProgress--;
		}
	};
	try {
		await video.play();
		// The pause event comes after this function returns, so the flag stays up until it arrives
		const isPlaying = !video.paused;
		if (isPlaying) {
			video.addEventListener('pause', release, { once: true });
		}
		video.pause();
		if (!isPlaying) {
			release();
		}
	} catch {
		// Playback was refused: the poster stays, the position is still set
		release();
	} finally {
		mutingSeeks--;
		if (mutingSeeks === 0) {
			video.muted = mutedBeforeSeeks;
		}
		// Flowplayer jumps to the first cue point on its first playback, so set the position again
		video.currentTime = seconds;
	}
};
