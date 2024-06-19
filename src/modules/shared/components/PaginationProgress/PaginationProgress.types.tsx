import { type ReactNode } from 'react';

export interface PaginationProgressProps {
	children?: ReactNode;
	start: number;
	end: number;
	total: number;
}
