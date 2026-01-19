import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';
import { mockStore } from '../../../../__mocks__/store';
import useScrollLock from './use-scroll-lock';

describe('Hooks', () => {
	describe('useScrollLock', () => {
		it('Should render without errors', () => {
			const wrapper = ({ children }: { children: ReactNode }) => (
				<Provider store={mockStore}>{children}</Provider>
			);

			expect(() => {
				renderHook(({ lock }) => useScrollLock(lock, 'Hooks'), {
					initialProps: { lock: true },
					wrapper,
				});
			}).not.toThrow();
		});
	});
});
