import { useAiIntervalSelection } from '@ie-objects/hooks/use-ai-interval-selection';
import {
	FileMentionAnnotationType,
	FileMentionEntityType,
	type FileMentionsResponse,
	ObjectDetailTabs,
} from '@ie-objects/ie-objects.types';
import type { AiEntity } from '@ie-objects/utils/map-ai-entities';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ video: null as HTMLVideoElement | null }));

vi.mock('@ie-objects/utils/seek-player-video', () => ({
	getPlayerVideoElement: () => state.video,
	seekPlayerVideo: vi.fn(),
}));

import { seekPlayerVideo } from '@ie-objects/utils/seek-player-video';

const entity: AiEntity = {
	id: 'jane',
	type: FileMentionEntityType.PERSON,
	name: 'Jane Doe',
	wikidataId: null,
	wikidataUrl: null,
	still: null,
	intervals: [
		{ start: 10, end: 15 },
		{ start: 60, end: 60 },
	],
};

const mentions = (overrides: Partial<FileMentionsResponse> = {}): FileMentionsResponse => ({
	fileId: 'file-1',
	durationSeconds: 120,
	hasAccessToEssence: true,
	mentions: [
		{
			id: 'jane',
			iri: 'iri',
			name: 'Jane Doe',
			type: FileMentionEntityType.PERSON,
			wikidataId: null,
			wikidataUrl: null,
			thumbnailUrl: null,
			occurrences: [10, 60].map((startTime, index) => ({
				startTime,
				endTime: index === 0 ? 15 : 60,
				confidence: 1,
				annotationType: FileMentionAnnotationType.FACE,
				isAiGenerated: true,
			})),
		},
	],
	...overrides,
});

const createVideo = (readyState = 4): HTMLVideoElement => {
	const video = document.createElement('video');
	Object.defineProperty(video, 'readyState', { value: readyState });
	return video;
};

const setup = (initialProps: Partial<Parameters<typeof useAiIntervalSelection>[0]> = {}) => {
	const updateActiveTab = vi.fn().mockResolvedValue(undefined);
	const updateQueryParams = vi.fn().mockResolvedValue(undefined);
	const props = {
		fileMentions: undefined,
		currentPlayableFileId: 'file-1',
		isMobile: false,
		activeTab: ObjectDetailTabs.Overview,
		updateActiveTab,
		updateQueryParams,
		...initialProps,
	};
	const hook = renderHook((hookProps: typeof props) => useAiIntervalSelection(hookProps), {
		initialProps: props,
	});
	return { ...hook, props, updateActiveTab, updateQueryParams };
};

describe('Hook: useAiIntervalSelection', () => {
	beforeEach(() => {
		state.video = createVideo();
		window.history.replaceState({}, '', '/');
	});

	afterEach(() => {
		vi.clearAllMocks();
		state.video = null;
		document.body.innerHTML = '';
	});

	describe('selectAiInterval', () => {
		it('highlights the interval, seeks the player and puts the interval in the url', () => {
			const { result, updateQueryParams, updateActiveTab } = setup();

			act(() => result.current.selectAiInterval(entity, 1));

			expect(result.current.activeAiInterval).toEqual({ entity, intervalIndex: 1 });
			expect(seekPlayerVideo).toHaveBeenCalledWith(state.video, 60);
			expect(updateQueryParams).toHaveBeenCalledWith({ aiEntity: 'jane', aiInterval: '1' });
			expect(updateActiveTab).not.toHaveBeenCalled();
		});

		it('brings the player into view on mobile when another tab is open, in one url update', () => {
			const { result, updateQueryParams, updateActiveTab } = setup({
				isMobile: true,
				activeTab: ObjectDetailTabs.Overview,
			});

			act(() => result.current.selectAiInterval(entity, 0));

			expect(updateActiveTab).toHaveBeenCalledWith(ObjectDetailTabs.Media, {
				aiEntity: 'jane',
				aiInterval: '0',
			});
			expect(updateQueryParams).not.toHaveBeenCalled();
		});

		it('stays on the media tab on mobile', () => {
			const { result, updateQueryParams, updateActiveTab } = setup({
				isMobile: true,
				activeTab: ObjectDetailTabs.Media,
			});

			act(() => result.current.selectAiInterval(entity, 0));

			expect(updateQueryParams).toHaveBeenCalledWith({ aiEntity: 'jane', aiInterval: '0' });
			expect(updateActiveTab).not.toHaveBeenCalled();
		});
	});

	describe('seek while the player is not rendered', () => {
		it('waits for the player to report it is ready and then seeks', () => {
			state.video = null;
			const { result } = setup();

			act(() => result.current.selectAiInterval(entity, 0));
			expect(seekPlayerVideo).not.toHaveBeenCalled();

			const video = createVideo();
			act(() => result.current.onPlayerReady(video));

			expect(seekPlayerVideo).toHaveBeenCalledTimes(1);
			expect(seekPlayerVideo).toHaveBeenCalledWith(video, 10);
		});

		it('seeks once: a player that is mounted again does not repeat it', () => {
			state.video = null;
			const { result } = setup();
			act(() => result.current.selectAiInterval(entity, 0));
			act(() => result.current.onPlayerReady(createVideo()));

			act(() => result.current.onPlayerReady(createVideo()));

			expect(seekPlayerVideo).toHaveBeenCalledTimes(1);
		});

		it('does nothing for a player that is ready when no seek waits', () => {
			const { result } = setup();

			act(() => result.current.onPlayerReady(createVideo()));

			expect(seekPlayerVideo).not.toHaveBeenCalled();
		});

		it('on mobile the player mounts when the media tab opens, and takes over the seek then', () => {
			state.video = null;
			const { result } = setup({ isMobile: true, activeTab: ObjectDetailTabs.Overview });
			act(() => result.current.selectAiInterval(entity, 1));
			expect(seekPlayerVideo).not.toHaveBeenCalled();

			const video = createVideo();
			act(() => result.current.onPlayerReady(video));

			expect(seekPlayerVideo).toHaveBeenCalledWith(video, 60);
		});

		it('seeks again when the media has loaded, as loading can reset the position', () => {
			state.video = null;
			const { result } = setup();
			act(() => result.current.selectAiInterval(entity, 0));
			const video = createVideo(0);
			act(() => result.current.onPlayerReady(video));
			expect(seekPlayerVideo).toHaveBeenCalledTimes(1);

			video.dispatchEvent(new Event('loadedmetadata'));

			expect(seekPlayerVideo).toHaveBeenCalledTimes(2);
			expect(seekPlayerVideo).toHaveBeenLastCalledWith(video, 10);
		});

		it('only the latest selection is seeked to', () => {
			state.video = null;
			const { result } = setup();
			act(() => result.current.selectAiInterval(entity, 0));
			act(() => result.current.selectAiInterval(entity, 1));

			act(() => result.current.onPlayerReady(createVideo()));

			expect(seekPlayerVideo).toHaveBeenCalledTimes(1);
			expect(seekPlayerVideo).toHaveBeenCalledWith(expect.anything(), 60);
		});

		it('forgets the seek when the interval is cleared before the player is there', () => {
			state.video = null;
			const { result } = setup();
			act(() => result.current.selectAiInterval(entity, 0));
			act(() => result.current.clearAiInterval());

			act(() => result.current.onPlayerReady(createVideo()));

			expect(seekPlayerVideo).not.toHaveBeenCalled();
		});

		it('forgets the seek when another file is played before the player is there', () => {
			state.video = null;
			const { result, rerender, props } = setup();
			act(() => result.current.selectAiInterval(entity, 0));

			rerender({ ...props, currentPlayableFileId: 'file-2' });
			act(() => result.current.onPlayerReady(createVideo()));

			expect(seekPlayerVideo).not.toHaveBeenCalled();
		});

		it('restores from the url into a player that mounts later', () => {
			state.video = null;
			window.history.replaceState({}, '', '/object?aiEntity=jane&aiInterval=1');
			const { result } = setup({ fileMentions: mentions() });
			expect(seekPlayerVideo).not.toHaveBeenCalled();

			const video = createVideo();
			act(() => result.current.onPlayerReady(video));

			expect(seekPlayerVideo).toHaveBeenCalledWith(video, 60);
		});
	});

	describe('restoring from the url', () => {
		beforeEach(() => {
			window.history.replaceState({}, '', '/object?aiEntity=jane&aiInterval=1');
		});

		it('restores the highlighted interval and seeks to it, once the mentions are known', () => {
			const { result, rerender, props } = setup();
			expect(result.current.activeAiInterval).toBeNull();

			rerender({ ...props, fileMentions: mentions() });

			expect(result.current.activeAiInterval?.entity.id).toBe('jane');
			expect(result.current.activeAiInterval?.intervalIndex).toBe(1);
			expect(seekPlayerVideo).toHaveBeenCalledWith(state.video, 60);
		});

		it('restores only once: a later selection is not overwritten when the mentions refetch', () => {
			const { result, rerender, props } = setup({ fileMentions: mentions() });
			act(() => result.current.selectAiInterval(entity, 0));

			rerender({ ...props, fileMentions: mentions() });

			expect(result.current.activeAiInterval?.intervalIndex).toBe(0);
		});

		it('ignores the url without access to the essence', () => {
			const { result } = setup({ fileMentions: mentions({ hasAccessToEssence: false }) });

			expect(result.current.activeAiInterval).toBeNull();
			expect(seekPlayerVideo).not.toHaveBeenCalled();
		});

		it.each([
			['an unknown entity', '/object?aiEntity=nobody&aiInterval=0'],
			['an interval that does not exist', '/object?aiEntity=jane&aiInterval=9'],
			['an interval that is not a number', '/object?aiEntity=jane&aiInterval=abc'],
			['no interval in the url', '/object'],
		])('ignores %s', (_label, url) => {
			window.history.replaceState({}, '', url);

			const { result } = setup({ fileMentions: mentions() });

			expect(result.current.activeAiInterval).toBeNull();
			expect(seekPlayerVideo).not.toHaveBeenCalled();
		});
	});

	it('drops the highlighted interval when another file is played', () => {
		const { result, rerender, props } = setup();
		act(() => result.current.selectAiInterval(entity, 0));
		expect(result.current.activeAiInterval).not.toBeNull();

		rerender({ ...props, currentPlayableFileId: 'file-2' });

		expect(result.current.activeAiInterval).toBeNull();
	});

	describe('url when another file is played', () => {
		it('removes the interval of the previous file from the url', () => {
			const { rerender, props, updateQueryParams } = setup();
			window.history.replaceState({}, '', '/object?aiEntity=jane&aiInterval=1');

			rerender({ ...props, currentPlayableFileId: 'file-2' });

			expect(updateQueryParams).toHaveBeenCalledWith({
				aiEntity: undefined,
				aiInterval: undefined,
			});
		});

		it('leaves the url alone while the first file is still being determined', () => {
			window.history.replaceState({}, '', '/object?aiEntity=jane&aiInterval=1');
			const { rerender, props, updateQueryParams } = setup({ currentPlayableFileId: null });

			rerender({ ...props, currentPlayableFileId: 'file-1' });

			expect(updateQueryParams).not.toHaveBeenCalled();
		});

		it('does not touch the url when it holds no interval', () => {
			const { rerender, props, updateQueryParams } = setup();

			rerender({ ...props, currentPlayableFileId: 'file-2' });

			expect(updateQueryParams).not.toHaveBeenCalled();
		});
	});

	it('clears the highlighted interval and removes it from the url', () => {
		const { result, updateQueryParams } = setup();
		act(() => result.current.selectAiInterval(entity, 0));

		act(() => result.current.clearAiInterval());

		expect(result.current.activeAiInterval).toBeNull();
		expect(updateQueryParams).toHaveBeenLastCalledWith({
			aiEntity: undefined,
			aiInterval: undefined,
		});
	});
});
