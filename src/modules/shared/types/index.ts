import { CSSProperties } from 'react';

export * from './api';
export * from './blade';
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
	Contains = 'aa',
	ContainsNot = 'ab',
	Equals = 'ac',
	EqualsNot = 'ad',
	LessThanOrEqual = 'ae', // shorter (duration) or until (date)
	GreaterThan = 'af', // longer (duration) or after (date)
	Between = 'ag', // duration & date
}

export type MediaTypes = 'video' | 'audio' | null;

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
