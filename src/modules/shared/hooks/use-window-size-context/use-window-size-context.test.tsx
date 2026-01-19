import { WindowSizeContext } from '@shared/context/WindowSizeContext';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import useWindowSizeContext from './use-window-size-context';

describe('Hooks', () => {
	describe('useWindowSizeContext()', () => {
		it("Should return the provider's current value", () => {
			const windowSize = { width: 1200, height: 600 };
			const wrapper = ({ children }: { children: ReactNode }) => (
				<WindowSizeContext.Provider value={windowSize}>{children}</WindowSizeContext.Provider>
			);
			const { result } = renderHook(() => useWindowSizeContext(), {
				initialProps: { children: null, value: windowSize },
				wrapper,
			});

			expect(result.current.height).toBe(windowSize.height);
			expect(result.current.width).toBe(windowSize.width);
		});
	});
});
