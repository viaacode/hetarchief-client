import { PaginationProps } from '@meemoo/react-components';

export interface PaginationBarProps extends Pick<PaginationProps, 'onPageChange'> {
	start: number;
	count: number;
	total: number;
}
