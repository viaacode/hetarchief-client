import { renderHook } from '@testing-library/react-hooks';

import useHistory from './use-history';

let mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
	useSelector: jest.fn(),
	useDispatch: () => mockDispatch,
}));

describe('Hooks', () => {
	describe('useHistory', () => {
		it('Should set isStickyLayout in the store', () => {
			mockDispatch = jest.fn();
			renderHook(() => useHistory());

			expect(mockDispatch).toHaveBeenCalled();
			expect(mockDispatch).toHaveBeenCalledTimes(1);
			expect(mockDispatch).toHaveBeenCalledWith({
				payload: true,
				type: 'ui/setIsStickyLayout',
			});
		});
	});
});
