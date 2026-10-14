import { act, render, screen } from '@testing-library/react';
import type { HetArchiefIeObjectRepresentation } from '@viaa/avo2-types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
	useGetIeObjectSubtitles: vi.fn(),
	useGetIeObjectsTicketUrl: vi.fn(),
	useGetFileDuration: vi.fn(),
	useGetPeakFile: vi.fn(),
	flowPlayer: vi.fn(),
	subtitlesTeaser: vi.fn(),
}));

vi.mock('@ie-objects/hooks/use-get-ie-object-subtitles', () => ({
	useGetIeObjectSubtitles: mocks.useGetIeObjectSubtitles,
}));
vi.mock('@ie-objects/hooks/use-get-ie-objects-ticket-url', () => ({
	useGetIeObjectsTicketUrl: mocks.useGetIeObjectsTicketUrl,
}));
vi.mock('@shared/hooks/use-get-file-duration', () => ({
	useGetFileDuration: mocks.useGetFileDuration,
}));
vi.mock('@shared/hooks/use-get-peak-file/use-get-peak-file', () => ({
	useGetPeakFile: mocks.useGetPeakFile,
}));
vi.mock('@ie-objects/components/ObjectPlaceholder', () => ({
	ObjectPlaceholder: () => <div data-testid="placeholder" />,
}));
vi.mock('@shared/components/Loading', () => ({
	Loading: () => <div data-testid="loading" />,
}));
vi.mock('@shared/components/SubtitlesTeaser', () => ({
	SubtitlesTeaser: (props: { playerRoot: HTMLElement | null }) => {
		mocks.subtitlesTeaser(props);
		return <div data-testid="subtitles-teaser" />;
	},
}));
vi.mock('@shared/config/public-runtime-config', () => ({
	default: () => ({ publicRuntimeConfig: { FLOW_PLAYER_TOKEN: 'token', FLOW_PLAYER_ID: 'id' } }),
}));
vi.mock('@shared/helpers/translate', () => ({
	tText: (key: string) => key.split('___')[1] ?? key,
}));
vi.mock('@meemoo/admin-core-ui/admin', () => ({
	Color: { Jade: 'jade', White: 'white', Ink: 'ink', Zinc: 'zinc' },
	FLOWPLAYER_CUSTOM_CONTROL_COLORS_HET_ARCHIEF: () => ({}),
	isAudioType: (format: string | null) => format === 'audio',
}));
vi.mock('@meemoo/react-components', () => ({
	FlowPlayer: (props: unknown) => {
		mocks.flowPlayer(props);
		return <div data-testid="flowplayer" />;
	},
	getValidStartAndEnd: () => [null, null],
}));

import { AudioOrVideoPlayer } from './AudioOrVideoPlayer';
import type { AudioOrVideoPlayerProps } from './AudioOrVideoPlayer.types';

const buildRepresentation = (...files: Array<[string, string]>) =>
	({
		files: files.map(([id, mimeType]) => ({ id, mimeType, name: id })),
		thumbnailUrl: 'thumb.jpg',
	}) as unknown as HetArchiefIeObjectRepresentation;

const VIDEO_WITH_SUBTITLES = buildRepresentation(
	['video-file', 'video/mp4'],
	['subtitle-file', 'text/vtt']
);

const buildProps = (overrides: Partial<AudioOrVideoPlayerProps> = {}): AudioOrVideoPlayerProps => ({
	paused: true,
	onPlay: vi.fn(),
	onPause: vi.fn(),
	onMediaReady: vi.fn(),
	dctermsFormat: 'video' as AudioOrVideoPlayerProps['dctermsFormat'],
	schemaIdentifier: 'qs6d5p9579',
	representation: VIDEO_WITH_SUBTITLES,
	maintainerLogo: undefined,
	cuePoints: undefined,
	locationId: 'test',
	poster: undefined,
	...overrides,
});

const lastFlowPlayerProps = () => mocks.flowPlayer.mock.calls.at(-1)?.[0];

describe('AudioOrVideoPlayer subtitles', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mocks.useGetIeObjectSubtitles.mockReturnValue({
			subtitlesUrl: 'blob:subtitles',
			isLoading: false,
		});
		mocks.useGetIeObjectsTicketUrl.mockReturnValue({
			data: 'https://media/video.mp4',
			isLoading: false,
			isFetching: false,
			isError: false,
		});
		mocks.useGetFileDuration.mockReturnValue({ data: 60, isLoading: false, isError: false });
		mocks.useGetPeakFile.mockReturnValue({ data: undefined, isLoading: false });
	});

	it('asks for the subtitles of the subtitle file of the representation', () => {
		render(<AudioOrVideoPlayer {...buildProps()} />);

		expect(mocks.useGetIeObjectSubtitles).toHaveBeenCalledWith('subtitle-file', 'qs6d5p9579');
	});

	it('asks for nothing when the representation has no subtitle file', () => {
		render(
			<AudioOrVideoPlayer
				{...buildProps({ representation: buildRepresentation(['video-file', 'video/mp4']) })}
			/>
		);

		expect(mocks.useGetIeObjectSubtitles).toHaveBeenCalledWith(undefined, 'qs6d5p9579');
	});

	it('waits for the subtitles instead of starting a player that would re-initialise', () => {
		mocks.useGetIeObjectSubtitles.mockReturnValue({ subtitlesUrl: undefined, isLoading: true });

		render(<AudioOrVideoPlayer {...buildProps()} />);

		expect(screen.getByTestId('loading')).toBeInTheDocument();
		expect(mocks.flowPlayer).not.toHaveBeenCalled();
	});

	it('gives the player a dutch, unselected, ai flagged subtitle track', () => {
		render(<AudioOrVideoPlayer {...buildProps()} />);

		expect(lastFlowPlayerProps().subtitles).toEqual([
			expect.objectContaining({
				id: 'subtitle-file',
				kind: 'subtitles',
				lang: 'nl',
				default: false,
				label: 'nederlands',
				src: 'blob:subtitles',
			}),
		]);
		expect(lastFlowPlayerProps().subtitles[0].subLabel).toContain('ai-gegenereerd');
		expect(screen.getByTestId('subtitles-teaser')).toBeInTheDocument();
	});

	it.each([
		['there is no subtitle file', buildRepresentation(['video-file', 'video/mp4']), 'blob:x'],
		['the subtitles could not be fetched', VIDEO_WITH_SUBTITLES, undefined],
	])('plays the video without subtitles or teaser when %s', (_label, representation, url) => {
		mocks.useGetIeObjectSubtitles.mockReturnValue({ subtitlesUrl: url, isLoading: false });

		render(<AudioOrVideoPlayer {...buildProps({ representation })} />);

		expect(screen.getByTestId('flowplayer')).toBeInTheDocument();
		expect(lastFlowPlayerProps().subtitles).toBeUndefined();
		expect(screen.queryByTestId('subtitles-teaser')).not.toBeInTheDocument();
	});

	it('keeps the same tracks across re-renders, the player re-initialises when they change', () => {
		const props = buildProps();
		const { rerender } = render(<AudioOrVideoPlayer {...props} />);
		const first = lastFlowPlayerProps().subtitles;

		rerender(<AudioOrVideoPlayer {...props} paused={false} />);

		expect(lastFlowPlayerProps().subtitles).toBe(first);
	});

	it('hands the teaser the player once it is ready, and passes the video on', async () => {
		const onPlayerReady = vi.fn();
		render(<AudioOrVideoPlayer {...buildProps({ onPlayerReady })} />);
		expect(mocks.subtitlesTeaser).toHaveBeenLastCalledWith({ playerRoot: null });

		const playerRoot = document.createElement('div');
		playerRoot.className = 'c-video-player-inner';
		const video = document.createElement('video');
		playerRoot.appendChild(video);

		await act(async () => {
			lastFlowPlayerProps().onReady(video);
		});

		expect(mocks.subtitlesTeaser).toHaveBeenLastCalledWith({ playerRoot });
		expect(onPlayerReady).toHaveBeenCalledWith(video, playerRoot);
	});

	it('also offers the subtitles on an audio player, without a fullscreen button', () => {
		render(
			<AudioOrVideoPlayer
				{...buildProps({
					dctermsFormat: 'audio' as AudioOrVideoPlayerProps['dctermsFormat'],
					representation: buildRepresentation(
						['audio-file', 'audio/mpeg'],
						['subtitle-file', 'text/vtt']
					),
				})}
			/>
		);

		const props = lastFlowPlayerProps();
		expect(props.type).toBe('audio');
		expect(props.subtitles).toHaveLength(1);
		expect(props.customControlsConfig.showFullscreen).toBe(false);
	});

	it('keeps the fullscreen button on a video player', () => {
		render(<AudioOrVideoPlayer {...buildProps()} />);

		expect(lastFlowPlayerProps().type).toBe('video');
		expect(lastFlowPlayerProps().customControlsConfig.showFullscreen).toBe(true);
	});
});
