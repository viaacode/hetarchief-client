export interface BladeManagerContextValue {
	isManaged: boolean;
	currentLayer: number;
	opacityStep: number;
	onCloseBlade: (layer: number) => void;
}
