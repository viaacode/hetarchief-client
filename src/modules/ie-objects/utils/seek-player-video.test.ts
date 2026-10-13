import { afterEach, describe, expect, it, vi } from 'vitest';

import { isSeekingPlayerVideo, seekPlayerVideo } from './seek-player-video';

const createVideo = (isStarting: boolean) => {
	const root = document.createElement('div');
	if (isStarting) {
		root.classList.add('is-starting');
	}
	const video = document.createElement('video');
	root.appendChild(video);
	document.body.appendChild(root);
	video.play = vi.fn().mockResolvedValue(undefined);
	video.pause = vi.fn();
	return video;
};

describe('seekPlayerVideo', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('only sets the position on a player that already started', async () => {
		const video = createVideo(false);

		await seekPlayerVideo(video, 42);

		expect(video.currentTime).toBe(42);
		expect(video.play).not.toHaveBeenCalled();
	});

	it('plays muted and pauses on a player that has not played yet, then restores the sound', async () => {
		const video = createVideo(true);
		video.muted = false;
		let mutedWhilePlaying: boolean | null = null;
		video.play = vi.fn().mockImplementation(async () => {
			mutedWhilePlaying = video.muted;
		});

		await seekPlayerVideo(video, 42);

		expect(mutedWhilePlaying).toBe(true);
		expect(video.pause).toHaveBeenCalled();
		expect(video.muted).toBe(false);
		expect(video.currentTime).toBe(42);
	});

	it('keeps a muted player muted', async () => {
		const video = createVideo(true);
		video.muted = true;

		await seekPlayerVideo(video, 5);

		expect(video.muted).toBe(true);
	});

	it('restores the sound after seeks that overlap', async () => {
		const video = createVideo(true);
		video.muted = false;
		const resolvers: (() => void)[] = [];
		video.play = vi.fn().mockImplementation(
			() =>
				new Promise<void>((resolve) => {
					resolvers.push(resolve);
				})
		);

		const first = seekPlayerVideo(video, 10);
		const second = seekPlayerVideo(video, 20);
		resolvers[0]();
		await first;
		// The second seek is still playing muted
		expect(video.muted).toBe(true);
		resolvers[1]();
		await second;

		expect(video.muted).toBe(false);
		expect(video.currentTime).toBe(20);
	});

	it('still sets the position when playback is refused', async () => {
		const video = createVideo(true);
		video.play = vi.fn().mockRejectedValue(new Error('NotAllowedError'));

		await seekPlayerVideo(video, 42);

		expect(video.currentTime).toBe(42);
		expect(video.pause).not.toHaveBeenCalled();
	});

	describe('isSeekingPlayerVideo', () => {
		// A video that really plays: paused follows play() and pause(), and pause() fires its event later
		const createPlayingVideo = () => {
			const video = createVideo(true);
			let isPaused = true;
			Object.defineProperty(video, 'paused', { get: () => isPaused });
			video.play = vi.fn().mockImplementation(async () => {
				isPaused = false;
			});
			video.pause = vi.fn().mockImplementation(() => {
				isPaused = true;
				setTimeout(() => video.dispatchEvent(new Event('pause')));
			});
			return video;
		};

		it('is true while the muted play runs and until its pause has been delivered', async () => {
			const video = createPlayingVideo();
			let seekingDuringPlay: boolean | null = null;
			const play = video.play;
			video.play = vi.fn().mockImplementation(async () => {
				seekingDuringPlay = isSeekingPlayerVideo();
				return play.call(video);
			});

			await seekPlayerVideo(video, 42);

			expect(seekingDuringPlay).toBe(true);
			// The pause event is still on its way, a handler for it must still see the seek
			expect(isSeekingPlayerVideo()).toBe(true);

			await new Promise((resolve) => setTimeout(resolve));

			expect(isSeekingPlayerVideo()).toBe(false);
		});

		it('is false again when playback is refused', async () => {
			const video = createVideo(true);
			video.play = vi.fn().mockRejectedValue(new Error('NotAllowedError'));

			await seekPlayerVideo(video, 42);

			expect(isSeekingPlayerVideo()).toBe(false);
		});

		it('is never true for a player that already started', async () => {
			const video = createVideo(false);

			await seekPlayerVideo(video, 42);

			expect(isSeekingPlayerVideo()).toBe(false);
		});
	});
});
