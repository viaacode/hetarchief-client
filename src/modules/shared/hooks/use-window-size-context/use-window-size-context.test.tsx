import { renderHook } from '@testing-library/react';
import { ReactNode } from 'react';

import { WindowSizeContext } from '@shared/context/WindowSizeContext';

import useWindowSizeContext from './use-window-size-context';

describe('Hooks', () => {
	describe('useWindowSizeContext()', () => {
		it("Should return the provider's current value", () => {
			const windowSize = { width: 1200, height: 600 };
			const wrapper = ({ children }: { children: ReactNode }) => (
				<WindowSizeContext.Provider value={windowSize}>
					{children}
				</WindowSizeContext.Provider>
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
