import { renderHook } from '@testing-library/react-hooks';
import { ReactNode } from 'react';

import { BladeManagerContext, BladeManagerContextValue } from '@shared/context/BladeManagerContext';

import useBladeManagerContext from './use-blade-manager-context';

describe('Hooks', () => {
	describe('useBladeManagerContext()', () => {
		it("Should return the provider's current value", () => {
			const wrapper = ({
				children,
				value,
			}: {
				children: ReactNode;
				value: BladeManagerContextValue;
			}) => (
				<BladeManagerContext.Provider value={value}>
					{children}
				</BladeManagerContext.Provider>
			);
			const bladeManagerValues: BladeManagerContextValue = {
				isManaged: true,
				currentLayer: 1,
				opacityStep: 0.1,
				onCloseBlade: () => null,
			};
			const { result } = renderHook(() => useBladeManagerContext(), {
				initialProps: { children: null, value: bladeManagerValues },
				wrapper,
			});

			expect(result.current.isManaged).toBe(bladeManagerValues.isManaged);
			expect(result.current.currentLayer).toBe(bladeManagerValues.currentLayer);
			expect(result.current.opacityStep).toBe(bladeManagerValues.opacityStep);
			expect(result.current.onCloseBlade).toBe(bladeManagerValues.onCloseBlade);
		});
	});
});
