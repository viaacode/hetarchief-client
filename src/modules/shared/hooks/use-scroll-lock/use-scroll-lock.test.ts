import { renderHook } from '@testing-library/react-hooks';

import useScrollLock from './use-scroll-lock';

describe('Hooks', () => {
	describe('useScrollLock', () => {
		it('Should lock and unlock scroll ', () => {
			const initialOverflow = 'scroll';
			const initialHeight = '500px';
			const el = document.createElement('div');
			el.style.overflow = initialOverflow;
			el.style.height = initialHeight;

			const { rerender } = renderHook(({ lock }) => useScrollLock(lock, el), {
				initialProps: { lock: true },
			});

			expect(el).toHaveStyle({ overflow: 'hidden' });

			rerender({ lock: false });
			expect(el).toHaveStyle({ overflow: initialOverflow, height: initialHeight });
		});
	});
});
