import { renderHook } from '@testing-library/react-hooks';

import useHistory from './use-history';

let mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
	useSelector: jest.fn(),
	useDispatch: () => mockDispatch,
}));

describe('Hooks', () => {
	describe('useHistory', () => {
		it('Should set history in the store', () => {
			mockDispatch = jest.fn();
			const path = '/';
			renderHook(() => useHistory(path, []));

			expect(mockDispatch).toHaveBeenCalled();
			expect(mockDispatch).toHaveBeenCalledTimes(1);
			expect(mockDispatch).toHaveBeenCalledWith({
				payload: [undefined, path],
				type: 'history/setHistory',
			});
		});
	});
});
