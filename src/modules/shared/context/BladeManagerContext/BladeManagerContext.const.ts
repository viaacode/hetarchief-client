import { BladeManagerContextValue } from './BladeManagerContext.types';

export const INITIAL_BLADE_MANAGER_CONTEXT_VALUE: BladeManagerContextValue = {
	isManaged: false,
	currentLayer: 0,
	opacityStep: 0,
	onCloseBlade: () => null,
};
