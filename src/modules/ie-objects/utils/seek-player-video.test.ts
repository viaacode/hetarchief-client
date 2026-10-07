import { afterEach, describe, expect, it, vi } from 'vitest';

import { seekPlayerVideo } from './seek-player-video';

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

	it('still sets the position when playback is refused', async () => {
		const video = createVideo(true);
		video.play = vi.fn().mockRejectedValue(new Error('NotAllowedError'));

		await seekPlayerVideo(video, 42);

		expect(video.currentTime).toBe(42);
		expect(video.pause).not.toHaveBeenCalled();
	});
});
