import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { FC, ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const getFileMentions = vi.hoisted(() => vi.fn());

vi.mock('@ie-objects/services', () => ({ IeObjectsService: { getFileMentions } }));

import { useGetIeObjectFileMentions } from './use-get-ie-object-file-mentions';

const response = { fileId: 'file-1', durationSeconds: 60, hasAccessToEssence: true, mentions: [] };

const renderMentionsHook = (
	schemaIdentifier: string | null | undefined,
	fileId: string | null | undefined,
	options?: { enabled: boolean }
) => {
	// Like the app: retries are on by default, the hook has to switch them off itself
	const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 3, retryDelay: 1 } } });
	const wrapper: FC<{ children: ReactNode }> = ({ children }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
	return renderHook(() => useGetIeObjectFileMentions(schemaIdentifier, fileId, options), {
		wrapper,
	});
};

describe('Hook: useGetIeObjectFileMentions', () => {
	beforeEach(() => {
		getFileMentions.mockReset();
		getFileMentions.mockResolvedValue(response);
	});

	it('fetches the mentions of the file', async () => {
		const { result } = renderMentionsHook('qs6d5p9579', 'file-1');

		await waitFor(() => expect(result.current.data).toEqual(response));
		expect(getFileMentions).toHaveBeenCalledWith('qs6d5p9579', 'file-1');
	});

	it.each([
		['the object', undefined, 'file-1'],
		['the file', 'qs6d5p9579', null],
	])('does not fetch without %s', async (_label, schemaIdentifier, fileId) => {
		const { result } = renderMentionsHook(schemaIdentifier, fileId);

		await new Promise((resolve) => setTimeout(resolve, 10));

		expect(getFileMentions).not.toHaveBeenCalled();
		expect(result.current.fetchStatus).toBe('idle');
	});

	it('does not fetch when the caller disables it, e.g. for visitors that are not key users', async () => {
		const { result } = renderMentionsHook('qs6d5p9579', 'file-1', { enabled: false });

		await new Promise((resolve) => setTimeout(resolve, 10));

		expect(getFileMentions).not.toHaveBeenCalled();
		expect(result.current.fetchStatus).toBe('idle');
	});

	it('does not retry a refusal: no access or no mentions is an expected answer', async () => {
		getFileMentions.mockRejectedValue(new Error('403'));
		const { result } = renderMentionsHook('qs6d5p9579', 'file-1');

		await waitFor(() => expect(result.current.isError).toBe(true));

		expect(getFileMentions).toHaveBeenCalledTimes(1);
	});
});
