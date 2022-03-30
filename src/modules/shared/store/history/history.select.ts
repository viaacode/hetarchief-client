import { AppState } from '../store.types';

export const selectHistory = (state: AppState): string[] => state.history.history;
export const selectPreviousUrl = (state: AppState): string | undefined =>
	state.history.history[state.history.history.length - 2];
