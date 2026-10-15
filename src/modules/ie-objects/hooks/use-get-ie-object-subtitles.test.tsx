import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { FC, ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const getSubtitles = vi.hoisted(() => vi.fn());

vi.mock('@ie-objects/services/ie-objects/ie-objects.service', () => ({
	IeObjectsService: { getSubtitles },
}));

import { useGetIeObjectSubtitles } from './use-get-ie-object-subtitles';

const vtt = new Blob(['WEBVTT'], { type: 'text/vtt' });

const renderSubtitlesHook = (
	fileId: string | null | undefined,
	schemaIdentifier: string | null | undefined
) => {
	// Like the app: retries are on by default, the hook has to switch them off itself
	const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 3, retryDelay: 1 } } });
	const wrapper: FC<{ children: ReactNode }> = ({ children }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
	return renderHook(() => useGetIeObjectSubtitles(fileId, schemaIdentifier), { wrapper });
};

describe('Hook: useGetIeObjectSubtitles', () => {
	const createObjectURL = vi.fn();
	const revokeObjectURL = vi.fn();

	beforeEach(() => {
		getSubtitles.mockReset();
		getSubtitles.mockResolvedValue(vtt);
		createObjectURL.mockReset();
		createObjectURL.mockReturnValue('blob:subtitles-1');
		revokeObjectURL.mockReset();
		URL.createObjectURL = createObjectURL;
		URL.revokeObjectURL = revokeObjectURL;
	});

	afterEach(() => {
		Reflect.deleteProperty(URL, 'createObjectURL');
		Reflect.deleteProperty(URL, 'revokeObjectURL');
	});

	it('fetches the subtitles of the file and hands them over as a blob url', async () => {
		const { result } = renderSubtitlesHook('file-1', 'qs6d5p9579');

		await waitFor(() => expect(result.current.subtitlesUrl).toBe('blob:subtitles-1'));
		expect(getSubtitles).toHaveBeenCalledWith('file-1', 'qs6d5p9579');
		expect(createObjectURL).toHaveBeenCalledWith(vtt);
		expect(result.current.isLoading).toBe(false);
	});

	it('is loading while the request runs', async () => {
		const { result } = renderSubtitlesHook('file-1', 'qs6d5p9579');

		expect(result.current).toEqual({ subtitlesUrl: undefined, isLoading: true });
		await waitFor(() => expect(result.current.isLoading).toBe(false));
	});

	it.each([
		['the file', undefined, 'qs6d5p9579'],
		['the object', 'file-1', null],
	])(
		'does not fetch without %s, and does not wait for it',
		async (_label, fileId, schemaIdentifier) => {
			const { result } = renderSubtitlesHook(fileId, schemaIdentifier);

			await new Promise((resolve) => setTimeout(resolve, 10));

			expect(getSubtitles).not.toHaveBeenCalled();
			expect(result.current).toEqual({ subtitlesUrl: undefined, isLoading: false });
		}
	);

	it('does not retry a refusal and yields no subtitles instead of an error', async () => {
		getSubtitles.mockRejectedValue(new Error('403'));
		const { result } = renderSubtitlesHook('file-1', 'qs6d5p9579');

		await waitFor(() => expect(result.current.isLoading).toBe(false));
		await new Promise((resolve) => setTimeout(resolve, 10));

		expect(getSubtitles).toHaveBeenCalledTimes(1);
		expect(result.current.subtitlesUrl).toBeUndefined();
		expect(createObjectURL).not.toHaveBeenCalled();
	});

	it('releases the blob url when the player goes away', async () => {
		const { result, unmount } = renderSubtitlesHook('file-1', 'qs6d5p9579');
		await waitFor(() => expect(result.current.subtitlesUrl).toBeDefined());

		unmount();

		expect(revokeObjectURL).toHaveBeenCalledWith('blob:subtitles-1');
	});

	it('keeps the same url across re-renders, which would re-initialise the player', async () => {
		const { result, rerender } = renderSubtitlesHook('file-1', 'qs6d5p9579');
		await waitFor(() => expect(result.current.subtitlesUrl).toBeDefined());

		rerender();
		rerender();

		expect(createObjectURL).toHaveBeenCalledTimes(1);
		expect(revokeObjectURL).not.toHaveBeenCalled();
	});
});
