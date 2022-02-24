import { CSSProperties } from 'react';

export * from './utils';
export * from './blade';
export * from './api';

/**
 * Generic components
 */

export interface DefaultComponentProps {
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

export enum OrderDirection {
	asc = 'asc',
	desc = 'desc',
}

export interface SortObject {
	orderProp: string;
	orderDirection?: OrderDirection;
}

/**
 * UI
 */

export enum Breakpoints {
	sm = 576,
	md = 768,
	lg = 992,
	xl = 1200,
}

export type AnimationTypes =
	| 'animate-default'
	| 'animate-sm-in'
	| 'animate-sm-out'
	| 'animate-md-in'
	| 'animate-md-out'
	| 'animate-lg-in'
	| 'animate-lg-out';
