import { renderHook } from '@testing-library/react-hooks';

import useNavigationBorder from './use-navigation-border';

let mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
	useSelector: jest.fn(),
	useDispatch: () => mockDispatch,
}));

describe('Hooks', () => {
	describe('useNavigationBorder', () => {
		it('Should set showNavigationBorder in the store', () => {
			mockDispatch = jest.fn();
			renderHook(() => useNavigationBorder());

			expect(mockDispatch).toHaveBeenCalled();
			expect(mockDispatch).toHaveBeenCalledTimes(1);
			expect(mockDispatch).toHaveBeenCalledWith({
				payload: true,
				type: 'ui/setShowNavigationBorder',
			});
		});

		it('Should unset showNavigationBorder in the store', () => {
			mockDispatch = jest.fn();
			renderHook(() => useNavigationBorder(false));

			expect(mockDispatch).toHaveBeenCalled();
			expect(mockDispatch).toHaveBeenCalledTimes(1);
			expect(mockDispatch).toHaveBeenCalledWith({
				payload: false,
				type: 'ui/setShowNavigationBorder',
			});
		});
	});
});
