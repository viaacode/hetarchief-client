import { act, renderHook } from '@testing-library/react';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ isSeeking: false }));

vi.mock('@ie-objects/utils/seek-player-video', () => ({
	isSeekingPlayerVideo: () => state.isSeeking,
}));

import { usePlayAfterSeek } from './use-play-after-seek';

describe('Hook: usePlayAfterSeek', () => {
	let video: HTMLVideoElement;

	beforeEach(() => {
		state.isSeeking = false;
		video = document.createElement('video');
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	const setup = () => {
		const onUserPlay = vi.fn();
		const hook = renderHook(({ callback }) => usePlayAfterSeek(callback), {
			initialProps: { callback: onUserPlay },
		});
		act(() => hook.result.current.listenToVideo(video));
		return { onUserPlay, ...hook };
	};

	const play = () => video.dispatchEvent(new Event('playing'));

	it('passes the report of the player on when the user plays', () => {
		const { result, onUserPlay } = setup();

		act(() => result.current.handlePlay());

		expect(onUserPlay).toHaveBeenCalledTimes(1);
	});

	it('does not count the muted play of a seek as playback', () => {
		const { result, onUserPlay } = setup();
		state.isSeeking = true;

		act(() => result.current.handlePlay());

		expect(onUserPlay).not.toHaveBeenCalled();
	});

	it('passes on the user’s own first play, which Flowplayer does not report again', () => {
		const { result, onUserPlay } = setup();
		state.isSeeking = true;
		act(() => result.current.handlePlay());
		// The playing event of the seek itself, before its pause has been delivered
		act(() => play());
		expect(onUserPlay).not.toHaveBeenCalled();

		state.isSeeking = false;
		act(() => play());

		expect(onUserPlay).toHaveBeenCalledTimes(1);
	});

	it('passes the user’s play on once, not on every later playing event', () => {
		const { result, onUserPlay } = setup();
		state.isSeeking = true;
		act(() => result.current.handlePlay());
		state.isSeeking = false;
		act(() => play());

		// e.g. resuming after buffering
		act(() => play());
		act(() => play());

		expect(onUserPlay).toHaveBeenCalledTimes(1);
	});

	it('ignores playing events when nothing was swallowed', () => {
		const { result, onUserPlay } = setup();
		act(() => result.current.handlePlay());
		onUserPlay.mockClear();

		act(() => play());

		expect(onUserPlay).not.toHaveBeenCalled();
	});

	it('uses the latest callback, as Flowplayer keeps the handler of its first render', () => {
		const { result, rerender } = setup();
		const latest = vi.fn();
		rerender({ callback: latest });

		act(() => result.current.handlePlay());

		expect(latest).toHaveBeenCalledTimes(1);
	});

	it('forgets a swallowed play when the player is mounted again', () => {
		const { result, onUserPlay } = setup();
		state.isSeeking = true;
		act(() => result.current.handlePlay());
		state.isSeeking = false;
		const newVideo = document.createElement('video');

		act(() => result.current.listenToVideo(newVideo));
		act(() => {
			newVideo.dispatchEvent(new Event('playing'));
		});

		expect(onUserPlay).not.toHaveBeenCalled();
	});

	it('stops listening to the previous video when the player is mounted again', () => {
		const { result, onUserPlay } = setup();
		act(() => result.current.listenToVideo(document.createElement('video')));
		state.isSeeking = true;
		act(() => result.current.handlePlay());
		state.isSeeking = false;

		act(() => play());

		expect(onUserPlay).not.toHaveBeenCalled();
	});

	it('stops listening on unmount', () => {
		const { result, onUserPlay, unmount } = setup();
		state.isSeeking = true;
		act(() => result.current.handlePlay());
		state.isSeeking = false;

		unmount();
		play();

		expect(onUserPlay).not.toHaveBeenCalled();
	});
});
