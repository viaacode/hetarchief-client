export type UseWindowSize = () => WindowSizeState;

export interface WindowSizeState {
	width: number | undefined;
	height: number | undefined;
}
