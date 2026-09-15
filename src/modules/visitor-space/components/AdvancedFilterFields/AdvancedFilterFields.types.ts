import type { IdentityAdvancedFilter } from '@visitor-space/types';
import type { ReactNode } from 'react';

export interface AdvancedFilterFieldsProps {
	children?: ReactNode;
	/** Unique per rendered row, since every filter form of the panel is mounted at once. */
	id: string;
	filterValue: IdentityAdvancedFilter;
	onChange: (value: IdentityAdvancedFilter) => void;
}
