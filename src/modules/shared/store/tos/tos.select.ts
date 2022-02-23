import { AppState } from '@shared/store';

import { TosState } from './tos.types';

export const selectTosUpdatedAt = (state: AppState): TosState['updatedAt'] => state.tos.updatedAt;
