import { PaginationProps } from '@meemoo/react-components';

import { DefaultComponentProps } from '@shared/types';

import { PaginationProgressProps } from '../PaginationProgress';

export interface PaginationBarProps
	extends DefaultComponentProps,
		Pick<PaginationProps, 'onPageChange'>,
		Pick<PaginationProgressProps, 'start' | 'total'> {
	count: number;
	showBackToTop?: boolean;
}
