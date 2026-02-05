import type { WindowSizeContextValue } from '@shared/context/WindowSizeContext';
import { Breakpoints } from '@shared/types';

export const isMobileSize = (windowSize: WindowSizeContextValue): boolean => {
	return !!(windowSize.width && windowSize.width < Breakpoints.md);
};

export const isTabletPortraitSize = (windowSize: WindowSizeContextValue): boolean => {
	return !!(windowSize.width && windowSize.width < Breakpoints.lg);
};
