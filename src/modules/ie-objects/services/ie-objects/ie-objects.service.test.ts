import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockJson = vi.fn();
const mockBlob = vi.fn();
const mockGet = vi.fn();

vi.mock('@shared/services/api-service', () => ({
	ApiService: { getApi: () => ({ get: mockGet }) },
}));

import { IeObjectsService } from './ie-objects.service';
import { IE_OBJECTS_SERVICE_SUBTITLES_TIMEOUT_MS } from './ie-objects.service.const';

describe('IeObjectsService', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGet.mockReturnValue({ json: mockJson, blob: mockBlob });
	});

	describe('getFileMentions()', () => {
		it('asks the mentions endpoint for the object and the file', async () => {
			mockJson.mockResolvedValue({ mentions: [] });

			await IeObjectsService.getFileMentions('qs6d5p9579', 'file-1');

			const url = new URL(mockGet.mock.calls[0][0] as string, 'http://localhost');
			expect(url.pathname).toMatch(/\/mentions$/);
			expect(url.searchParams.get('schemaIdentifier')).toBe('qs6d5p9579');
			expect(url.searchParams.get('fileId')).toBe('file-1');
		});

		it('encodes ids that are not url safe', async () => {
			mockJson.mockResolvedValue({ mentions: [] });

			await IeObjectsService.getFileMentions('a&b=c', 'file 1/2');

			const url = new URL(mockGet.mock.calls[0][0] as string, 'http://localhost');
			expect(url.searchParams.get('schemaIdentifier')).toBe('a&b=c');
			expect(url.searchParams.get('fileId')).toBe('file 1/2');
		});

		it('returns the response of the proxy', async () => {
			const response = {
				fileId: 'file-1',
				durationSeconds: 60,
				hasAccessToEssence: true,
				mentions: [],
			};
			mockJson.mockResolvedValue(response);

			await expect(IeObjectsService.getFileMentions('qs6d5p9579', 'file-1')).resolves.toBe(
				response
			);
		});

		it('lets a refusal through to the caller', async () => {
			mockJson.mockRejectedValue(new Error('403'));

			await expect(IeObjectsService.getFileMentions('qs6d5p9579', 'file-1')).rejects.toThrow('403');
		});
	});

	describe('getSubtitles()', () => {
		it('asks the subtitles endpoint for the object and the file', async () => {
			mockBlob.mockResolvedValue(new Blob(['WEBVTT']));

			await IeObjectsService.getSubtitles('file-1', 'qs6d5p9579');

			const url = new URL(mockGet.mock.calls[0][0] as string, 'http://localhost');
			expect(url.pathname).toMatch(/\/subtitles$/);
			expect(url.searchParams.get('schemaIdentifier')).toBe('qs6d5p9579');
			expect(url.searchParams.get('fileId')).toBe('file-1');
		});

		it('encodes ids that are not url safe', async () => {
			mockBlob.mockResolvedValue(new Blob(['WEBVTT']));

			await IeObjectsService.getSubtitles('file 1/2', 'a&b=c');

			const url = new URL(mockGet.mock.calls[0][0] as string, 'http://localhost');
			expect(url.searchParams.get('schemaIdentifier')).toBe('a&b=c');
			expect(url.searchParams.get('fileId')).toBe('file 1/2');
		});

		it('gives up sooner than the default timeout, playback waits for it', async () => {
			mockBlob.mockResolvedValue(new Blob(['WEBVTT']));

			await IeObjectsService.getSubtitles('file-1', 'qs6d5p9579');

			expect(mockGet.mock.calls[0][1]).toEqual({
				timeout: IE_OBJECTS_SERVICE_SUBTITLES_TIMEOUT_MS,
			});
			expect(IE_OBJECTS_SERVICE_SUBTITLES_TIMEOUT_MS).toBeLessThan(30_000);
		});

		it('returns the vtt as a blob', async () => {
			const blob = new Blob(['WEBVTT'], { type: 'text/vtt' });
			mockBlob.mockResolvedValue(blob);

			await expect(IeObjectsService.getSubtitles('file-1', 'qs6d5p9579')).resolves.toBe(blob);
		});
	});
});
