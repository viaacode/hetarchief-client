import { renderHook } from '@testing-library/react-hooks';

import useScrollLock from './use-scroll-lock';

describe('Hooks', () => {
	describe('useScrollLock', () => {
		it('Should lock and unlock scroll ', () => {
			const initialOverflow = 'scroll';
			const el = document.createElement('div');
			el.style.overflow = initialOverflow;

			const { rerender } = renderHook(({ lock }) => useScrollLock(el, lock), {
				initialProps: { lock: true },
			});

			expect(el).toHaveStyle({ overflow: 'hidden' });

			rerender({ lock: false });
			expect(el).toHaveStyle({ overflow: initialOverflow });
		});
	});
});
