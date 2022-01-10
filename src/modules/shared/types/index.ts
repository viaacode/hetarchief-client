import { CSSProperties } from 'react';

export interface DefaultComponentProps {
	className?: string;
	style?: CSSProperties;
}

export interface ComponentLink {
	label: string;
	to: string;
	external?: boolean;
}

export type SortOrder = 'asc' | 'desc';

export enum Breakpoints {
	sm = 576,
	md = 768,
	lg = 992,
	xl = 1200,
}
