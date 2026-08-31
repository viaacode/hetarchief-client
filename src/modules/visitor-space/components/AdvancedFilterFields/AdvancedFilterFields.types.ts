import type { IdentityAdvancedFilter } from '@visitor-space/types';
import type { ReactNode } from 'react';

export interface AdvancedFilterFieldsProps {
	children?: ReactNode;
	id: string;
	index: number;
	filterValue: IdentityAdvancedFilter;
	onChange: (index: number, value: IdentityAdvancedFilter) => void;
	onRemove: (index: number) => void;
	/** The property is fixed when this row belongs to one filter, so its dropdown is hidden. */
	hideProperty?: boolean;
}
