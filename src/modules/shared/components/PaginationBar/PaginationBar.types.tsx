import { PaginationProps } from '@meemoo/react-components';

import { PaginationProgressProps } from '../PaginationProgress';

export interface PaginationBarProps
	extends Pick<PaginationProps, 'onPageChange'>,
		Pick<PaginationProgressProps, 'start' | 'total'> {
	count: number;
	showBackToTop?: boolean;
}
