import { AppState } from '../store.types';

// TODO: replace this with actual select
export const selectRandomBoolean = (state: AppState): boolean => state.ui.randomBoolean;
