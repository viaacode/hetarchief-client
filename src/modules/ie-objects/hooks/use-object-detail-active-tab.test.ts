import { ObjectDetailTabs } from '@ie-objects/ie-objects.types';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const replace = vi.fn().mockResolvedValue(true);
vi.mock('next/router', () => ({ useRouter: () => ({ replace }) }));

import {
	getDefaultObjectDetailTab,
	parseObjectDetailTab,
	useObjectDetailActiveTab,
	useResetUnavailableTab,
} from './use-object-detail-active-tab';

const setUrl = (search: string) => window.history.replaceState({}, '', `/object${search}`);

describe('getDefaultObjectDetailTab', () => {
	it.each([
		[false, false, ObjectDetailTabs.Overview],
		[false, true, ObjectDetailTabs.Overview], // namenlijst only applies to newspapers
		[true, false, ObjectDetailTabs.Overview],
		[true, true, ObjectDetailTabs.Metadata],
	])('newspaper %s, namenlijst filter %s -> %s', (isNewspaper, hasFilter, expected) => {
		expect(getDefaultObjectDetailTab(isNewspaper, hasFilter)).toBe(expected);
	});
});

describe('parseObjectDetailTab', () => {
	it('accepts every known tab', () => {
		for (const tab of Object.values(ObjectDetailTabs)) {
			expect(parseObjectDetailTab(tab)).toBe(tab);
		}
	});

	it.each([['nope'], [''], [null], [undefined], [['ocr', 'metadata']], [42]])(
		'rejects %j',
		(value) => {
			expect(parseObjectDetailTab(value)).toBeUndefined();
		}
	);
});

describe('useObjectDetailActiveTab', () => {
	beforeEach(() => {
		replace.mockClear();
		setUrl('');
	});

	const render = (props: Parameters<typeof useObjectDetailActiveTab>[0]) =>
		renderHook((p) => useObjectDetailActiveTab(p), { initialProps: props });

	it('waits for the object before applying a default tab', () => {
		const { result } = render({
			objectId: undefined,
			isNewspaper: false,
		});

		expect(result.current.activeTab).toBe(ObjectDetailTabs.Overview);
		expect(replace).not.toHaveBeenCalled();
	});

	it('defaults to Overview without writing it to the url', () => {
		const { result } = render({ objectId: 'a', isNewspaper: false });

		expect(result.current.activeTab).toBe(ObjectDetailTabs.Overview);
		expect(replace).not.toHaveBeenCalled();
	});

	it('defaults to Metadata for a newspaper with a namenlijst filter', () => {
		setUrl('?mentions=jan');
		const { result } = render({ objectId: 'a', isNewspaper: true });

		expect(result.current.activeTab).toBe(ObjectDetailTabs.Metadata);
	});

	it('also detects several namenlijst filter values', () => {
		setUrl('?mentions=jan&mentions=piet');
		const { result } = render({ objectId: 'a', isNewspaper: true });

		expect(result.current.activeTab).toBe(ObjectDetailTabs.Metadata);
	});

	it('ignores an empty namenlijst filter', () => {
		setUrl('?mentions=');
		const { result } = render({ objectId: 'a', isNewspaper: true });

		expect(result.current.activeTab).toBe(ObjectDetailTabs.Overview);
	});

	it('keeps a tab from the url on desktop deep links', () => {
		setUrl(`?tab=${ObjectDetailTabs.Ocr}`);
		const { result } = render({ objectId: 'a', isNewspaper: false });

		expect(result.current.activeTab).toBe(ObjectDetailTabs.Ocr);
		expect(replace).not.toHaveBeenCalled();
	});

	it('falls back to the default when the url tab is not a known tab', () => {
		setUrl('?tab=nope');
		const { result } = render({ objectId: 'a', isNewspaper: false });

		expect(result.current.activeTab).toBe(ObjectDetailTabs.Overview);
	});

	it('does not reset the tab when only the other props change (refetch)', async () => {
		const { result, rerender } = render({
			objectId: 'a',
			isNewspaper: false,
		});
		await act(() => result.current.updateActiveTab(ObjectDetailTabs.Metadata));
		replace.mockClear();

		rerender({ objectId: 'a', isNewspaper: true });

		expect(result.current.activeTab).toBe(ObjectDetailTabs.Metadata);
		expect(replace).not.toHaveBeenCalled();
	});

	it('re-applies the default when navigating to another object', async () => {
		const { result, rerender } = render({
			objectId: 'a',
			isNewspaper: false,
		});
		await act(() => result.current.updateActiveTab(ObjectDetailTabs.Metadata));
		setUrl(''); // a new object url carries no tab

		rerender({ objectId: 'b', isNewspaper: false });

		expect(result.current.activeTab).toBe(ObjectDetailTabs.Overview);
	});

	it('syncs to the url tab when navigating to another object', async () => {
		const { result, rerender } = render({
			objectId: 'a',
			isNewspaper: false,
		});
		setUrl(`?tab=${ObjectDetailTabs.Metadata}`);

		rerender({ objectId: 'b', isNewspaper: false });

		expect(result.current.activeTab).toBe(ObjectDetailTabs.Metadata);
		expect(replace).not.toHaveBeenCalled();
	});

	it('updateActiveTab falls back to Overview for null and keeps other query params', async () => {
		setUrl('?foo=bar');
		const { result } = render({
			objectId: undefined,
			isNewspaper: false,
		});

		await act(() => result.current.updateActiveTab(null));

		expect(result.current.activeTab).toBe(ObjectDetailTabs.Overview);
		expect(replace.mock.calls[0][0]).toContain('foo=bar');
		expect(replace.mock.calls[0][0]).toContain(`=${ObjectDetailTabs.Overview}`);
	});
});

describe('useResetUnavailableTab', () => {
	const base = {
		activeTab: ObjectDetailTabs.Ocr,
		availableTabIds: [ObjectDetailTabs.Overview, ObjectDetailTabs.Metadata],
		isMobile: false,
		isReady: true,
	};

	it('resets to Overview when the tab does not exist for this object', () => {
		const updateActiveTab = vi.fn();
		renderHook(() => useResetUnavailableTab({ ...base, updateActiveTab }));

		expect(updateActiveTab).toHaveBeenCalledWith(ObjectDetailTabs.Overview);
	});

	it('leaves an available tab alone', () => {
		const updateActiveTab = vi.fn();
		renderHook(() =>
			useResetUnavailableTab({ ...base, activeTab: ObjectDetailTabs.Metadata, updateActiveTab })
		);

		expect(updateActiveTab).not.toHaveBeenCalled();
	});

	it('does nothing while the data is still loading', () => {
		const updateActiveTab = vi.fn();
		renderHook(() => useResetUnavailableTab({ ...base, isReady: false, updateActiveTab }));

		expect(updateActiveTab).not.toHaveBeenCalled();
	});

	it('only allows the media tab on mobile', () => {
		const updateActiveTab = vi.fn();
		const props = {
			...base,
			activeTab: ObjectDetailTabs.Media,
			availableTabIds: [ObjectDetailTabs.Overview, ObjectDetailTabs.Media],
			updateActiveTab,
		};

		renderHook(() => useResetUnavailableTab({ ...props, isMobile: true }));
		expect(updateActiveTab).not.toHaveBeenCalled();

		renderHook(() => useResetUnavailableTab({ ...props, isMobile: false }));
		expect(updateActiveTab).toHaveBeenCalledWith(ObjectDetailTabs.Overview);
	});
});
