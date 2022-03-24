import { CSSProperties } from 'react';

export * from './api';
export * from './blade';
export * from './media';
export * from './sidebar';
export * from './utils';
export * from './visit';

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

// 2-letter for url parsing
export enum Operator {
	Contains = 'co',
	ContainsNot = 'nc',
	Equals = 'eq',
	EqualsNot = 'ne',
	LessThanOrEqual = 'lt', // shorter (duration) or until (date)
	GreaterThanOrEqual = 'gt', // longer (duration) or after (date)
	Between = 'bt', // duration & date
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
