import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import useHideFooter from './use-hide-footer';

let mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
	useSelector: vi.fn(),
	useDispatch: () => mockDispatch,
}));

describe('Hooks', () => {
	describe('useHideFooter', () => {
		it('Should set showFooter in the store', () => {
			mockDispatch = vi.fn();
			renderHook(() => useHideFooter());

			expect(mockDispatch).toHaveBeenCalled();
			expect(mockDispatch).toHaveBeenCalledTimes(1);
			expect(mockDispatch).toHaveBeenCalledWith({
				payload: false,
				type: 'ui/setShowFooter',
			});
		});

		it('Should unset showFooter in the store', () => {
			mockDispatch = vi.fn();
			renderHook(() => useHideFooter(true));

			expect(mockDispatch).toHaveBeenCalled();
			expect(mockDispatch).toHaveBeenCalledTimes(1);
			expect(mockDispatch).toHaveBeenCalledWith({
				payload: true,
				type: 'ui/setShowFooter',
			});
		});
	});
});
