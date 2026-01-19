import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import useHideNavigationHeaderRight from './use-hide-navigation-header-right';

let mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
	useSelector: vi.fn(),
	useDispatch: () => mockDispatch,
}));

describe('Hooks', () => {
	describe('UseHideNavigationHeaderRight', () => {
		it('Should set showNavigationHeaderRight in the store', () => {
			mockDispatch = vi.fn();
			renderHook(() => useHideNavigationHeaderRight());

			expect(mockDispatch).toHaveBeenCalled();
			expect(mockDispatch).toHaveBeenCalledTimes(1);
			expect(mockDispatch).toHaveBeenCalledWith({
				payload: false,
				type: 'ui/setShowNavigationHeaderRight',
			});
		});

		it('Should unset showNavigationHeaderRight in the store', () => {
			mockDispatch = vi.fn();
			renderHook(() => useHideNavigationHeaderRight(true));

			expect(mockDispatch).toHaveBeenCalled();
			expect(mockDispatch).toHaveBeenCalledTimes(1);
			expect(mockDispatch).toHaveBeenCalledWith({
				payload: true,
				type: 'ui/setShowNavigationHeaderRight',
			});
		});
	});
});
