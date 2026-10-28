import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useMultiselect } from './use-multiselect';

describe('useMultiselect', () => {
	it('opens with the clicked object selected and toggles objects', () => {
		const { result } = renderHook(() => useMultiselect('search-1'));
		expect(result.current.isActive).toBe(false);

		act(() => result.current.open(['a']));
		expect(result.current.isActive).toBe(true);
		expect(result.current.selectedIds).toEqual(['a']);

		act(() => result.current.toggle('b'));
		act(() => result.current.toggle('a'));
		expect(result.current.selectedIds).toEqual(['b']);
		expect(result.current.isSelected('b')).toBe(true);
		expect(result.current.isSelected('a')).toBe(false);
	});

	it('selects all objects on the page without duplicates and deselects all', () => {
		const { result } = renderHook(() => useMultiselect('search-1'));
		act(() => result.current.open(['b']));
		act(() => result.current.selectMany(['a', 'b', 'c']));
		expect(result.current.selectedIds).toEqual(['b', 'a', 'c']);

		act(() => result.current.deselect('a'));
		expect(result.current.selectedIds).toEqual(['b', 'c']);

		act(() => result.current.deselectAll());
		expect(result.current.selectedIds).toEqual([]);
		expect(result.current.isActive).toBe(true);
	});

	it('replaces the selection without duplicates', () => {
		const { result } = renderHook(() => useMultiselect('search-1'));
		act(() => result.current.open(['a', 'b', 'c']));
		act(() => result.current.selectOnly(['d', 'b', 'd']));
		expect(result.current.selectedIds).toEqual(['d', 'b']);
	});

	it('closes and clears the selection', () => {
		const { result } = renderHook(() => useMultiselect('search-1'));
		act(() => result.current.open(['a', 'b']));
		act(() => result.current.close());
		expect(result.current.isActive).toBe(false);
		expect(result.current.selectedIds).toEqual([]);
	});

	it('silently closes when the search changes', () => {
		const { result, rerender } = renderHook(({ resetKey }) => useMultiselect(resetKey), {
			initialProps: { resetKey: 'search-1' },
		});
		act(() => result.current.open(['a', 'b']));
		rerender({ resetKey: 'search-1' });
		expect(result.current.isActive).toBe(true);

		rerender({ resetKey: 'search-2' });
		expect(result.current.isActive).toBe(false);
		expect(result.current.selectedIds).toEqual([]);
	});
});
