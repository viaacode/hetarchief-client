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
