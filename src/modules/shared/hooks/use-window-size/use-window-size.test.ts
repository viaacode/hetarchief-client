import { act, renderHook, waitFor } from '@testing-library/react';

import useWindowSize from './use-window-size';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
declare const window: any; // TODO declare window type

describe('Hooks', () => {
	describe('useWindowSize()', () => {
		it('Should update width and height on resize', async () => {
			const resize = { innerHeight: 600, innerWidth: 1200 };
			const { result } = renderHook(() => useWindowSize());

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
