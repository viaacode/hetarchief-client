import { renderHook } from '@testing-library/react-hooks';
import { ReactNode } from 'react';

import { WindowSizeContext, WindowSizeContextValue } from '@shared/context/WindowSizeContext';

import useWindowSizeContext from './use-window-size-context';

describe('Hooks', () => {
	describe('useWindowSizeContext()', () => {
		it("Should return the provider's current value", () => {
			const wrapper = ({
				children,
				value,
			}: {
				children: ReactNode;
				value: WindowSizeContextValue;
			}) => <WindowSizeContext.Provider value={value}>{children}</WindowSizeContext.Provider>;
			const windowSize = { width: 1200, height: 600 };
			const { result } = renderHook(() => useWindowSizeContext(), {
				initialProps: { children: null, value: windowSize },
				wrapper,
			});

			expect(result.current.height).toBe(windowSize.height);
			expect(result.current.width).toBe(windowSize.width);
		});
	});
});
