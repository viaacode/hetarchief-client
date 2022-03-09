import { renderHook } from '@testing-library/react-hooks';

import useFooter from './use-footer';

let mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
	useSelector: jest.fn(),
	useDispatch: () => mockDispatch,
}));

describe('Hooks', () => {
	describe('useFooter', () => {
		it('Should set showFooter in the store', () => {
			mockDispatch = jest.fn();
			renderHook(() => useFooter());

			expect(mockDispatch).toHaveBeenCalled();
			expect(mockDispatch).toHaveBeenCalledTimes(1);
			expect(mockDispatch).toHaveBeenCalledWith({
				payload: false,
				type: 'ui/setShowFooter',
			});
		});

		it('Should unset showFooter in the store', () => {
			mockDispatch = jest.fn();
			renderHook(() => useFooter(true));

			expect(mockDispatch).toHaveBeenCalled();
			expect(mockDispatch).toHaveBeenCalledTimes(1);
			expect(mockDispatch).toHaveBeenCalledWith({
				payload: true,
				type: 'ui/setShowFooter',
			});
		});
	});
});
