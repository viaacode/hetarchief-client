import { beforeEach, describe, expect, it, vi } from 'vitest';
import { updateQueryParamsShallow } from './update-query-params-shallow';

const setUrl = (search: string) => window.history.replaceState({}, '', `/object${search}`);
const queryOf = (url: string) => Object.fromEntries(new URL(url, 'http://x').searchParams);

describe('updateQueryParamsShallow', () => {
	beforeEach(() => {
		setUrl('?foo=bar');
	});

	it('keeps the existing params', async () => {
		const replace = vi.fn().mockResolvedValue(true);
		await updateQueryParamsShallow({ replace }, { tab: 'ocr' });

		expect(queryOf(replace.mock.calls[0][0])).toEqual({ foo: 'bar', tab: 'ocr' });
		expect(replace.mock.calls[0][2]).toEqual({ shallow: true });
	});

	it('removes params set to undefined', async () => {
		setUrl('?foo=bar&expandSidebar=1');
		const replace = vi.fn().mockResolvedValue(true);
		await updateQueryParamsShallow({ replace }, { expandSidebar: undefined });

		expect(queryOf(replace.mock.calls[0][0])).toEqual({ foo: 'bar' });
	});

	it('does not lose params of updates that are still pending', async () => {
		// window.location only changes when a route change finishes, so it stays stale here
		const replace = vi.fn().mockResolvedValue(true);
		await Promise.all([
			updateQueryParamsShallow({ replace }, { tab: 'ocr' }),
			updateQueryParamsShallow({ replace }, { textOverlay: true }),
			updateQueryParamsShallow({ replace }, { expandSidebar: '1' }),
		]);

		expect(queryOf(replace.mock.calls[2][0])).toEqual({
			foo: 'bar',
			tab: 'ocr',
			textOverlay: 'true',
			expandSidebar: '1',
		});
	});

	it('starts from the url again once the pending updates are done', async () => {
		const replace = vi.fn().mockResolvedValue(true);
		await updateQueryParamsShallow({ replace }, { tab: 'ocr' });
		await updateQueryParamsShallow({ replace }, { textOverlay: true });

		expect(queryOf(replace.mock.calls[1][0])).toEqual({ foo: 'bar', textOverlay: 'true' });
	});

	it('swallows a route change that was cancelled by a newer one', async () => {
		const replace = vi
			.fn()
			.mockRejectedValue(Object.assign(new Error('cancelled'), { cancelled: true }));

		await expect(updateQueryParamsShallow({ replace }, { tab: 'ocr' })).resolves.toBeUndefined();
	});

	it('starts from the url again after a failed update', async () => {
		const replace = vi.fn().mockRejectedValueOnce(new Error('boom')).mockResolvedValue(true);
		await updateQueryParamsShallow({ replace }, { tab: 'ocr' });
		await updateQueryParamsShallow({ replace }, { textOverlay: true });

		expect(queryOf(replace.mock.calls[1][0])).toEqual({ foo: 'bar', textOverlay: 'true' });
	});

	it('removes params set to undefined while other updates are pending', async () => {
		setUrl('?foo=bar&expandSidebar=1');
		const replace = vi.fn().mockResolvedValue(true);
		await Promise.all([
			updateQueryParamsShallow({ replace }, { tab: 'ocr' }),
			updateQueryParamsShallow({ replace }, { expandSidebar: undefined }),
		]);

		expect(queryOf(replace.mock.calls[1][0])).toEqual({ foo: 'bar', tab: 'ocr' });
	});
});
