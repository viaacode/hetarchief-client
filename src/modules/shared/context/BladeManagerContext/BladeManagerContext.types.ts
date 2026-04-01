export interface BladeManagerContextValue {
	isManaged: boolean;
	currentLayer: number;
	opacityStep: number;
	onCloseBlade: (layer: number, currentLayer: number) => void;
	bladeWidths: Record<number, boolean>;
	registerBladeWidth: (layer: number, isWide: boolean) => void;
}
