import { renderHook } from '@testing-library/react-hooks';

import useHideNavigationHeaderRight from './use-hide-navigation-header-right';

let mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
	useSelector: jest.fn(),
	useDispatch: () => mockDispatch,
}));

describe('Hooks', () => {
	describe('UseHideNavigationHeaderRight', () => {
		it('Should set showNavigationHeaderRight in the store', () => {
			mockDispatch = jest.fn();
			renderHook(() => useHideNavigationHeaderRight());

			expect(mockDispatch).toHaveBeenCalled();
			expect(mockDispatch).toHaveBeenCalledTimes(1);
			expect(mockDispatch).toHaveBeenCalledWith({
				payload: false,
				type: 'ui/setShowNavigationHeaderRight',
			});
		});

		it('Should unset showNavigationHeaderRight in the store', () => {
			mockDispatch = jest.fn();
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
