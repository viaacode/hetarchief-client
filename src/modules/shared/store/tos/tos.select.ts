import { type AppState } from '@shared/store';

import { type TosState } from './tos.types';

export const selectTosUpdatedAt = (state: AppState): TosState['updatedAt'] => state?.tos?.updatedAt;
