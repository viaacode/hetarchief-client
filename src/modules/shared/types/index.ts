import { type OrderDirection } from '@meemoo/react-components';
import { type CSSProperties, type ReactNode } from 'react';

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
	Exact = 'ex', // duration
}

export const isRange = (op?: string): boolean => op === Operator.Between;

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
