import { renderHook } from '@testing-library/react-hooks';

import useHideFooter from './use-hide-footer';

let mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
	useSelector: jest.fn(),
	useDispatch: () => mockDispatch,
}));

describe('Hooks', () => {
	describe('useHideFooter', () => {
		it('Should set showFooter in the store', () => {
			mockDispatch = jest.fn();
			renderHook(() => useHideFooter());

			expect(mockDispatch).toHaveBeenCalled();
			expect(mockDispatch).toHaveBeenCalledTimes(1);
			expect(mockDispatch).toHaveBeenCalledWith({
				payload: false,
				type: 'ui/setShowFooter',
			});
		});

		it('Should unset showFooter in the store', () => {
			mockDispatch = jest.fn();
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
