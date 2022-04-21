import { renderHook } from '@testing-library/react-hooks';

import useScrollLock from './use-scroll-lock';

describe('Hooks', () => {
	describe('useScrollLock', () => {
		it('Should lock and unlock scroll ', () => {
			const { rerender } = renderHook(({ lock }) => useScrollLock(lock, 'Hooks'), {
				initialProps: { lock: true },
			});

			expect(document.body).toHaveStyle({ overflowY: 'hidden' });
			expect(document.body).toHaveAttribute('data-depth');

			rerender({ lock: false });

			expect(document.body).not.toHaveStyle({ overflowY: 'hidden' });
			expect(document.body).not.toHaveAttribute('data-depth');
		});
	});
});
