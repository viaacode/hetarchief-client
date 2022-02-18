import { renderHook } from '@testing-library/react-hooks';
import { ReactNode } from 'react';

import { NavigationContext, NavigationContextValue } from '@shared/context/NavigationContext';

import useNavigationContext from './use-navigation-context';

describe('Hooks', () => {
	describe('useNavigationContext()', () => {
		it("Should return the provider's current value", () => {
			const wrapper = ({
				children,
				value,
			}: {
				children: ReactNode;
				value: NavigationContextValue;
			}) => <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
			const navigationValues: NavigationContextValue = {
				navigationBorderBottom: true,
				setNavigationBorderBottom: () => null,
			};
			const { result } = renderHook(() => useNavigationContext(), {
				initialProps: { children: null, value: navigationValues },
				wrapper,
			});

			expect(result.current.navigationBorderBottom).toBe(
				navigationValues.navigationBorderBottom
			);
			expect(result.current.setNavigationBorderBottom).toBe(
				navigationValues.setNavigationBorderBottom
			);
		});

		it("Should set the provider's current value", () => {
			const wrapper = ({
				children,
				value,
			}: {
				children: ReactNode;
				value: NavigationContextValue;
			}) => <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
			const navigationValues: NavigationContextValue = {
				navigationBorderBottom: true,
				setNavigationBorderBottom: jest.fn(),
			};

			renderHook(() => useNavigationContext({ isBordered: false }), {
				initialProps: { children: null, value: navigationValues },
				wrapper,
			});

			expect(navigationValues.setNavigationBorderBottom).toHaveBeenCalled();
			expect(navigationValues.setNavigationBorderBottom).toHaveBeenCalledTimes(1);
			expect(navigationValues.setNavigationBorderBottom).toHaveBeenCalledWith(false);
		});
	});
});
