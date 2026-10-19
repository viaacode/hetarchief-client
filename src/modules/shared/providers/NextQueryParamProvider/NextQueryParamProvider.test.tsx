import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const replace = vi.fn();
vi.mock('next/router', () => ({
	useRouter: () => ({
		replace,
		push: vi.fn(),
		pathname: '/object',
		asPath: `${window.location.pathname}${window.location.search}`,
		isReady: true,
		query: {},
	}),
}));

import { useQueryParams } from 'use-query-params';
import NextQueryParamProvider from './NextQueryParamProvider';

const setUrl = (search: string) => window.history.replaceState({}, '', `/object${search}`);
const queryOf = (search: string) => Object.fromEntries(new URLSearchParams(search));
// The search string of the url the adapter navigated to
const replacedSearch = (call: number) => replace.mock.calls[call][1].search as string;

const renderSetter = () =>
	renderHook(() => useQueryParams({})[1], { wrapper: NextQueryParamProvider }).result.current;

describe('NextQueryParamProvider', () => {
	beforeEach(() => {
		replace.mockReset().mockResolvedValue(true);
		setUrl('?foo=bar');
	});

	it('does a shallow route change that keeps the existing params', async () => {
		const setQuery = renderSetter();
		await act(async () => setQuery({ tab: 'ocr' }, 'replaceIn'));

		expect(queryOf(replacedSearch(0))).toEqual({ foo: 'bar', tab: 'ocr' });
		expect(replace.mock.calls[0][2]).toEqual({ shallow: true, scroll: false });
	});

	it('does not lose params of updates that are still pending', async () => {
		// window.location only changes when a route change finishes, so it stays stale here
		const setQuery = renderSetter();
		await act(async () => {
			setQuery({ tab: 'ocr' }, 'replaceIn');
			setQuery({ textOverlay: true }, 'replaceIn');
			setQuery({ expandSidebar: '1' }, 'replaceIn');
		});

		expect(queryOf(replacedSearch(2))).toEqual({
			foo: 'bar',
			tab: 'ocr',
			textOverlay: 'true',
			expandSidebar: '1',
		});
	});

	it('starts from the url again once the pending updates are done', async () => {
		const setQuery = renderSetter();
		await act(async () => setQuery({ tab: 'ocr' }, 'replaceIn'));
		await act(async () => setQuery({ textOverlay: true }, 'replaceIn'));

		expect(queryOf(replacedSearch(1))).toEqual({ foo: 'bar', textOverlay: 'true' });
	});

	it('swallows a route change that was cancelled by a newer one', async () => {
		replace.mockRejectedValue(Object.assign(new Error('cancelled'), { cancelled: true }));
		const setQuery = renderSetter();
		await act(async () => setQuery({ tab: 'ocr' }, 'replaceIn'));

		// The cancelled update is no longer pending
		replace.mockResolvedValue(true);
		await act(async () => setQuery({ textOverlay: true }, 'replaceIn'));
		expect(queryOf(replacedSearch(1))).toEqual({ foo: 'bar', textOverlay: 'true' });
	});
});
