import { Breakpoints } from '@shared/types';
import { SEARCH_RESULTS_PAGE_SIZE } from '@visitor-space/const';

export const MEDIA_CARD_LIST_GRID_BP_COLS = {
	default: 4,
	[Breakpoints.lg]: 3,
	[Breakpoints.md]: 2,
	[Breakpoints.sm]: 1,
};

export const MAX_COUNT_SEARCH_RESULTS = 10000;
export const PAGE_NUMBER_OF_MANY_RESULTS_TILE = Math.ceil(
	MAX_COUNT_SEARCH_RESULTS / SEARCH_RESULTS_PAGE_SIZE
);
