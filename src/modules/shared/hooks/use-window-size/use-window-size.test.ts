import { act, renderHook } from '@testing-library/react-hooks';

import useWindowSize from './use-window-size';

describe('Hooks', () => {
	describe('useWindowSize()', () => {
		it('Should update width and height on resize', async () => {
			const resize = { innerHeight: 600, innerWidth: 1200 };
			const { result, waitFor } = renderHook(() => useWindowSize());

			act(() => {
				window.innerWidth = resize.innerWidth;
				window.innerHeight = resize.innerHeight;
				window.dispatchEvent(new Event('resize'));
			});

			await waitFor(() => {
				expect(result.current.height).toBe(resize.innerHeight);
				expect(result.current.width).toBe(resize.innerWidth);
			});
		});
	});
});
