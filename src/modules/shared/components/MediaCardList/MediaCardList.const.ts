import { Breakpoints } from '@shared/types';
import { VISITOR_SPACE_ITEM_COUNT } from '@visitor-space/const';

export const MEDIA_CARD_LIST_GRID_BP_COLS = {
	default: 4,
	[Breakpoints.lg]: 3,
	[Breakpoints.md]: 2,
	[Breakpoints.sm]: 1,
};

export const RESULTS_MAX = 10000;
export const MANY_RESULTS_TILE_POSITION = RESULTS_MAX % VISITOR_SPACE_ITEM_COUNT;
export const PAGE_NUMBER_OF_MANY_RESULTS_TILE = Math.ceil(RESULTS_MAX / VISITOR_SPACE_ITEM_COUNT);
