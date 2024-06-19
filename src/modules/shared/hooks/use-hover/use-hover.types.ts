import { type ReactNode } from 'react';

export interface HoverProps {
	children?: ReactNode;
	onMouseEnter: () => void;
	onMouseLeave: () => void;
}
