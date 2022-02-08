import { renderHook } from '@testing-library/react-hooks';

import useStickyLayout from './use-sticky-layout';

let mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
	useSelector: jest.fn(),
	useDispatch: () => mockDispatch,
}));

describe('Hooks', () => {
	describe('useStickyLayout', () => {
		it('Should set isStickyLayout in the store', () => {
			mockDispatch = jest.fn();
			renderHook(() => useStickyLayout(true));

			expect(mockDispatch).toHaveBeenCalled();
			expect(mockDispatch).toHaveBeenCalledTimes(1);
			expect(mockDispatch).toHaveBeenCalledWith({
				payload: true,
				type: 'ui/setIsStickyLayout',
			});
		});

		it('Should unset isStickyLayout in the store', () => {
			mockDispatch = jest.fn();
			renderHook(() => useStickyLayout(false));

			expect(mockDispatch).toHaveBeenCalled();
			expect(mockDispatch).toHaveBeenCalledTimes(1);
			expect(mockDispatch).toHaveBeenCalledWith({
				payload: false,
				type: 'ui/setIsStickyLayout',
			});
		});
	});
});
