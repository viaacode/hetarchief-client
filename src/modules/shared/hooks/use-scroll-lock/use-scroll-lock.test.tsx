import { renderHook, waitFor } from '@testing-library/react';
import React, { type ReactNode } from 'react';
import { Provider } from 'react-redux';

import { mockStore } from '../../../../__mocks__/store';

import useScrollLock from './use-scroll-lock';

describe('Hooks', () => {
	describe('useScrollLock', () => {
		it('Should lock and unlock scroll ', () => {
			const wrapper = ({ children }: { children: ReactNode }) => (
				<Provider store={mockStore}>{children}</Provider>
			);
			const { rerender } = renderHook(({ lock }) => useScrollLock(lock, 'Hooks'), {
				initialProps: { lock: true },
				wrapper,
			});

			waitFor(() => {
				expect(document.body).toHaveStyle({ overflowY: 'hidden' });
				expect(document).toHaveProperty('__scrollDepth');
			}).then(() => {
				rerender({ lock: false });

				waitFor(() => {
					expect(document.body).not.toHaveStyle({ overflowY: 'hidden' });
					expect(document).not.toHaveProperty('__scrollDepth');
				});
			});
		});
	});
});
