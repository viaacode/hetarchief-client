import { renderHook } from '@testing-library/react';
import { type ReactNode } from 'react';

import {
	BladeManagerContext,
	type BladeManagerContextValue,
} from '@shared/context/BladeManagerContext';
import { useBladeManagerContext } from '@shared/hooks/use-blade-manager-context/use-blade-manager-context';

describe('Hooks', () => {
	describe('useBladeManagerContext()', () => {
		it("Should return the provider's current value", () => {
			const bladeManagerValues: BladeManagerContextValue = {
				isManaged: true,
				currentLayer: 1,
				opacityStep: 0.1,
				onCloseBlade: () => null,
			};
			const wrapper = ({ children }: { children: ReactNode }) => (
				<BladeManagerContext.Provider value={bladeManagerValues}>
					{children}
				</BladeManagerContext.Provider>
			);
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
