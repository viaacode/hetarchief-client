import type { HetArchiefIeObjectFile } from '@viaa/avo2-types';
import { describe, expect, it } from 'vitest';

import { getSubtitleFile, getSubtitleTracks } from './get-subtitle-tracks';

const buildFile = (id: string, mimeType: string): HetArchiefIeObjectFile =>
	({ id, mimeType }) as HetArchiefIeObjectFile;

describe('getSubtitleFile', () => {
	it('returns undefined when there are no files', () => {
		expect(getSubtitleFile(undefined)).toBeUndefined();
		expect(getSubtitleFile([])).toBeUndefined();
	});

	it('returns undefined when no file is a subtitle file', () => {
		expect(getSubtitleFile([buildFile('video', 'video/mp4')])).toBeUndefined();
	});

	it('returns the subtitle file next to the video', () => {
		expect(
			getSubtitleFile([buildFile('video', 'video/mp4'), buildFile('subtitle', 'text/vtt')])?.id
		).toEqual('subtitle');
	});

	it('also picks up srt files, the proxy converts them to vtt', () => {
		expect(getSubtitleFile([buildFile('subtitle', 'application/x-subrip')])?.id).toEqual(
			'subtitle'
		);
	});

	it('prefers the vtt over the srt of the same transcript, whatever the order', () => {
		expect(
			getSubtitleFile([buildFile('srt', 'application/x-subrip'), buildFile('vtt', 'text/vtt')])?.id
		).toEqual('vtt');
	});

	it('only uses one subtitle file', () => {
		expect(
			getSubtitleFile([buildFile('first', 'text/vtt'), buildFile('second', 'text/vtt')])?.id
		).toEqual('first');
	});
});

describe('getSubtitleTracks', () => {
	const options = { src: 'blob:subtitles', label: 'Nederlands', disclaimer: 'AI-gegenereerd' };

	it('returns undefined without a subtitle file', () => {
		expect(getSubtitleTracks(undefined, options)).toBeUndefined();
	});

	it('returns undefined until the subtitles are loaded', () => {
		expect(
			getSubtitleTracks(buildFile('subtitle', 'text/vtt'), { ...options, src: undefined })
		).toBeUndefined();
	});

	it('returns one Dutch track that is off by default', () => {
		expect(getSubtitleTracks(buildFile('subtitle', 'text/vtt'), options)).toEqual([
			{
				id: 'subtitle',
				kind: 'subtitles',
				lang: 'nl',
				default: false,
				label: 'Nederlands',
				subLabel: 'AI-gegenereerd',
				src: 'blob:subtitles',
				icon: expect.anything(),
			},
		]);
	});

	it('never sets crossorigin: the player would apply it to the video element', () => {
		const [track] = getSubtitleTracks(buildFile('subtitle', 'text/vtt'), options) ?? [];

		expect(track).not.toHaveProperty('crossorigin');
	});
});
