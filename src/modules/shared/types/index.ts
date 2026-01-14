import type { AvoSearchOrderDirection } from '@viaa/avo2-types';
import type { CSSProperties, ReactNode } from 'react';

/**
 * Generic components
 */

export interface DefaultComponentProps {
	children?: ReactNode;
	className?: string;
	style?: CSSProperties;
}

export interface ComponentLink {
	label: string;
	to: string;
	external?: boolean;
}

/**
 * Filter / Sort
 */

export interface SortObject {
	orderProp: string;
	orderDirection?: AvoSearchOrderDirection;
}

/**
 * UI
 */

export enum Breakpoints {
	sm = 576,
	md = 768,
	lg = 992,
	xl = 1200,
	xxl = 1400,
}

export type AnimationTypes =
	| 'animate-default'
	| 'animate-sm-in'
	| 'animate-sm-out'
	| 'animate-md-in'
	| 'animate-md-out'
	| 'animate-lg-in'
	| 'animate-lg-out';
