import { type PaginationProps } from '@meemoo/react-components';
import { type ReactNode } from 'react';

import { type DefaultComponentProps } from '@shared/types';

import { type PaginationProgressProps } from '../PaginationProgress';

export interface PaginationBarProps
	extends DefaultComponentProps,
		Pick<PaginationProps, 'onPageChange'>,
		Pick<PaginationProgressProps, 'start' | 'total'> {
	children?: ReactNode;
	count: number;
	showBackToTop?: boolean;
}
