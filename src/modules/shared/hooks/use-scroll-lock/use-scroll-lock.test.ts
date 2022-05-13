import { renderHook } from '@testing-library/react-hooks';

import useScrollLock from './use-scroll-lock';

describe('Hooks', () => {
	describe('useScrollLock', () => {
		it('Should lock and unlock scroll ', () => {
			const { rerender, waitForNextUpdate } = renderHook(
				({ lock }) => useScrollLock(lock, 'Hooks'),
				{
					initialProps: { lock: true },
				}
			);

			waitForNextUpdate().then(() => {
				expect(document.body).toHaveStyle({ overflowY: 'hidden' });
				expect(document).toHaveProperty('__scrollDepth');

				rerender({ lock: false });

				waitForNextUpdate().then(() => {
					expect(document.body).not.toHaveStyle({ overflowY: 'hidden' });
					expect(document).not.toHaveProperty('__scrollDepth');
				});
			});
		});
	});
});
